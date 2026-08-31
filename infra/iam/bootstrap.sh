#!/usr/bin/env bash
# Provisions the long-lived kalyanam-deploy IAM user in the dedicated
# Kalyanam AWS account, using a temporary admin profile.
#
# See /Users/kavin/.claude/plans/dapper-popping-firefly.md (Part 2) for the
# full plan this implements.
#
# Prerequisites (done by hand, in the AWS console, in the new account):
#   1. A temporary IAM user `kalyanam-bootstrap` with AdministratorAccess
#      and an access key.
#   2. That key configured locally as the AWS CLI profile named by
#      BOOTSTRAP_PROFILE below (default: kalyanam-bootstrap), e.g.:
#        aws configure set aws_access_key_id     <key>   --profile kalyanam-bootstrap
#        aws configure set aws_secret_access_key <secret> --profile kalyanam-bootstrap
#        aws configure set region ap-south-1               --profile kalyanam-bootstrap
#
# After this script finishes successfully:
#   - Delete kalyanam-bootstrap's access key, then the user itself, in the
#     console (or: aws iam delete-access-key / aws iam delete-user with the
#     bootstrap profile, before it's gone).
#   - The new [kalyanam] profile in ~/.aws/credentials is what every deploy
#     uses from then on (backend/package.json's `deploy` script sets
#     AWS_PROFILE=kalyanam).
set -euo pipefail

BOOTSTRAP_PROFILE="${BOOTSTRAP_PROFILE:-kalyanam-bootstrap}"
DEPLOY_PROFILE="kalyanam"
REGION="ap-south-1"
POLICY_NAME="KalyanamDeploy"
USER_NAME="kalyanam-deploy"
BUDGET_NAME="kalyanam-zero-cost-guard"
ALERT_EMAIL="kavinder.singh.3702@gmail.com"
POLICY_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/kalyanam-deploy-policy.json"

echo "==> Verifying bootstrap profile '$BOOTSTRAP_PROFILE'..."
ACCOUNT_ID=$(aws sts get-caller-identity --profile "$BOOTSTRAP_PROFILE" --query Account --output text)
CALLER_ARN=$(aws sts get-caller-identity --profile "$BOOTSTRAP_PROFILE" --query Arn --output text)
echo "    Account: $ACCOUNT_ID"
echo "    Caller:  $CALLER_ARN"
read -r -p "    Proceed provisioning kalyanam-deploy in this account? [y/N] " CONFIRM
[[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]] || { echo "Aborted."; exit 1; }

echo "==> Creating (or reusing) managed policy $POLICY_NAME..."
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"
if aws iam get-policy --profile "$BOOTSTRAP_PROFILE" --policy-arn "$POLICY_ARN" >/dev/null 2>&1; then
  echo "    Policy already exists, creating a new version instead..."
  aws iam create-policy-version --profile "$BOOTSTRAP_PROFILE" \
    --policy-arn "$POLICY_ARN" \
    --policy-document "file://${POLICY_FILE}" \
    --set-as-default >/dev/null
else
  aws iam create-policy --profile "$BOOTSTRAP_PROFILE" \
    --policy-name "$POLICY_NAME" \
    --policy-document "file://${POLICY_FILE}" \
    --description "Scoped deploy permissions for the kalyanam-api Lambda service (kalyanam-api-* resources only)" >/dev/null
fi
echo "    $POLICY_ARN"

echo "==> Creating (or reusing) IAM user $USER_NAME..."
if aws iam get-user --profile "$BOOTSTRAP_PROFILE" --user-name "$USER_NAME" >/dev/null 2>&1; then
  echo "    User already exists."
else
  aws iam create-user --profile "$BOOTSTRAP_PROFILE" --user-name "$USER_NAME" >/dev/null
fi

echo "==> Attaching $POLICY_NAME to $USER_NAME..."
aws iam attach-user-policy --profile "$BOOTSTRAP_PROFILE" \
  --user-name "$USER_NAME" --policy-arn "$POLICY_ARN"

echo "==> Creating access key for $USER_NAME..."
KEY_JSON=$(aws iam create-access-key --profile "$BOOTSTRAP_PROFILE" --user-name "$USER_NAME")
ACCESS_KEY_ID=$(echo "$KEY_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["AccessKey"]["AccessKeyId"])')
SECRET_ACCESS_KEY=$(echo "$KEY_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["AccessKey"]["SecretAccessKey"])')

echo "==> Writing local profile [$DEPLOY_PROFILE]..."
aws configure set aws_access_key_id "$ACCESS_KEY_ID" --profile "$DEPLOY_PROFILE"
aws configure set aws_secret_access_key "$SECRET_ACCESS_KEY" --profile "$DEPLOY_PROFILE"
aws configure set region "$REGION" --profile "$DEPLOY_PROFILE"
aws configure set output json --profile "$DEPLOY_PROFILE"

echo "==> Creating \$1/month budget guardrail '$BUDGET_NAME'..."
BUDGET_JSON=$(cat <<EOF
{
  "BudgetName": "${BUDGET_NAME}",
  "BudgetLimit": {"Amount": "1.0", "Unit": "USD"},
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
EOF
)
NOTIFICATIONS_JSON=$(cat <<EOF
[
  {
    "Notification": {"NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 0.01, "ThresholdType": "ABSOLUTE_VALUE"},
    "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "${ALERT_EMAIL}"}]
  },
  {
    "Notification": {"NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 50, "ThresholdType": "PERCENTAGE"},
    "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "${ALERT_EMAIL}"}]
  },
  {
    "Notification": {"NotificationType": "FORECASTED", "ComparisonOperator": "GREATER_THAN", "Threshold": 100, "ThresholdType": "PERCENTAGE"},
    "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "${ALERT_EMAIL}"}]
  }
]
EOF
)
if aws budgets describe-budget --profile "$BOOTSTRAP_PROFILE" --account-id "$ACCOUNT_ID" --budget-name "$BUDGET_NAME" >/dev/null 2>&1; then
  echo "    Budget already exists, skipping creation."
else
  aws budgets create-budget --profile "$BOOTSTRAP_PROFILE" \
    --account-id "$ACCOUNT_ID" \
    --budget "$BUDGET_JSON" \
    --notifications-with-subscribers "$NOTIFICATIONS_JSON" >/dev/null
  echo "    Created."
fi

echo
echo "==> Done. Verifying the new profile is scoped correctly..."
aws sts get-caller-identity --profile "$DEPLOY_PROFILE"
echo "    (this should succeed)"
if aws ec2 describe-instances --profile "$DEPLOY_PROFILE" >/dev/null 2>&1; then
  echo "    WARNING: ec2:DescribeInstances succeeded — the policy is not scoped as expected."
else
  echo "    Confirmed: ec2:DescribeInstances is denied, as expected."
fi

cat <<'EOF'

Next steps:
  1. In the AWS console (or with the bootstrap profile), delete
     kalyanam-bootstrap's access key and then the user itself — it should
     not persist past this point.
  2. cd backend && npm run deploy   (uses AWS_PROFILE=kalyanam automatically)
EOF
