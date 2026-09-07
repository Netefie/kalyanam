# Kalyanam AWS deploy user — setup

Provisions a scoped, non-admin IAM user (`kalyanam-deploy`) for deploying the
backend to Lambda, in a dedicated AWS account, at $0/month. Full plan and
reasoning: `/Users/kavin/.claude/plans/dapper-popping-firefly.md`.

## One-time setup

1. **Create the AWS account** (console, by hand — no API for this):
   https://portal.aws.amazon.com/billing/signup. Use region
   `ap-south-1` (Mumbai), pick the **Paid** plan (not the credit-capped Free
   plan), enable MFA on root, and under Billing → Account settings turn on
   "IAM user and role access to Billing".

2. **Create a temporary bootstrap user**, console → IAM → Users → Create user
   → name `kalyanam-bootstrap` → attach `AdministratorAccess` directly →
   create an access key (CLI type). Configure it locally:
   ```bash
   aws configure set aws_access_key_id     <key>    --profile kalyanam-bootstrap
   aws configure set aws_secret_access_key <secret> --profile kalyanam-bootstrap
   aws configure set region ap-south-1               --profile kalyanam-bootstrap
   ```

3. **Run the bootstrap script**:
   ```bash
   ./infra/iam/bootstrap.sh
   ```
   This creates the `KalyanamDeploy` managed policy (from
   `kalyanam-deploy-policy.json`), the `kalyanam-deploy` IAM user, an access
   key written to the local `[kalyanam]` AWS CLI profile, and a $1/month
   budget guardrail (`kalyanam-zero-cost-guard`) emailing alerts at the first
   cent spent. It ends by confirming the new profile can identify itself but
   is denied EC2 access — proof the scoping actually works.

4. **Delete the bootstrap user** — console → IAM → Users →
   `kalyanam-bootstrap` → delete the access key, then delete the user. It
   should not exist past this point; only `kalyanam-deploy` (scoped) remains.

## What the policy allows

Everything in `kalyanam-deploy-policy.json` is pinned to resources named
`kalyanam-api-*` in `ap-south-1` — CloudFormation stacks, S3 buckets, Lambda
functions, IAM roles, CloudWatch log groups, EventBridge rules. It cannot
create EC2 instances, touch any other project's resources, or do anything
outside that resource-name prefix. If a future `serverless deploy` fails with
an `AccessDenied` for an action not in this file, add that one action (scoped
the same way) rather than widening to `*`.

## Day-to-day deploy

```bash
cd backend
npm run deploy   # AWS_PROFILE=kalyanam npx serverless deploy
npm run logs      # tail the API function's logs
```
