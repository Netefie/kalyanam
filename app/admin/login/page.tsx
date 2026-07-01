"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff} from "lucide-react";

export default function AdminLogin() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");
  const router = useRouter();

 const handleLogin = (
  e: React.FormEvent
) => {
  e.preventDefault();

  const ADMIN_EMAIL = "admin@kalyanam.com";
  const ADMIN_PASSWORD = "Kalyanam@346";

  if (
    email === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  ) {
    router.push("/admin/dashboard");
  } else {
    alert("Invalid Email or Password");
  }
};

  return (
    <>
      <section className="loginPage">

        {/* LEFT */}

        <div className="leftSide">

          <Image
            src="/ambience-3.jpg"
            alt="Luxury Hotel"
            fill
            priority
            className="bgImage"
          />

          <div className="overlay" />


        </div>

        {/* RIGHT */}

        <div className="rightSide">

          <form
            onSubmit={handleLogin}
            className="loginCard"
          >

            <div className="logoCircle">

              <Image
                src="/logo.png"
                alt="Logo"
                width={70}
                height={70}
              />

            </div>

            
            <h3>
              Admin Login
            </h3>

            

            {/* Email */}

            <div className="inputGroup">

              <label>
                Email Address
              </label>

              <div className="inputWrapper">

               

                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* Password */}

            <div className="inputGroup">

              <label>
                Password
              </label>

              <div className="inputWrapper">

              

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="eyeButton"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            <div className="options">

              <label>

                <input
                  type="checkbox"
                />

                Remember Me

              </label>

              

            </div>

            <button
              className="loginButton"
            >
              Secure Login
            </button>

            <p className="powered">

              Powered by

              <strong>
                {" "}
                Netefie
              </strong>

            </p>

          </form>

        </div>

      </section>
   <style jsx>{`
      .loginPage {
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: #fcf8f2;
}

/* ========================= */
/* LEFT */
/* ========================= */

.leftSide {
  position: relative;
  overflow: hidden;
}

.bgImage {
  object-fit: cover;
}



.leftContent {
  position: absolute;
  left: 70px;
  bottom: 70px;
  z-index: 2;
  max-width: 520px;
  color: white;
  animation: fadeLeft .9s ease;
}



/* ========================= */
/* RIGHT */
/* ========================= */

.rightSide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      rgba(252,248,242,.95),
      rgba(252,248,242,.95)
    ),
    url("/pattern.png");
    padding: 0 60px;
}

.loginCard {
  width: 100%;
  max-width: 570px;
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(30px);
  border: 1px solid #ece2cf;
  border-radius: 0px;
  padding: 13px;
  box-shadow: 0 35px 80px rgba(0,0,0,.08);
  animation: fadeRight .9s ease;
}

.logoCircle {
  
  margin: auto;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}



.loginCard h3 {
  margin: 0;
  text-align: center;
  font-size: 30px;
  font-family: var(--font-cormorant);
  color: #222;
}

.subtitle {
  text-align: center;
  color: #888;
  margin: 12px 0 40px;
}
/* ========================= */
/* INPUTS */
/* ========================= */

.inputGroup{
  margin-bottom:24px;
}

.inputGroup label{
  display:block;
  margin-bottom:5px;
  font-size:13px;
  font-weight:600;
  color:#555;
  letter-spacing:.5px;
}

.inputWrapper{
  position:relative;
  display:flex;
  align-items:center;
  height:60px;
  border:1px solid #e5dac6;
  border-radius:14px;
  background:#fff;
  transition:.35s ease;
}

.inputWrapper:hover{
  border-color:#d5b06a;
}

.inputWrapper:focus-within{
  border-color:#b68d40;
  box-shadow:0 0 0 4px rgba(182,141,64,.12);
}



.inputWrapper input{
  flex:1;
  height:100%;
  border:none;
  outline:none;
  background:transparent;
  padding:0 18px;
  font-size:15px;
  color:#222;
  font-family:inherit;
}

.inputWrapper input::placeholder{
  color:#b8b8b8;
}

.eyeButton{
  width:56px;
  height:100%;
  border:none;
  background:none;
  display:flex;
  justify-content:center;
  align-items:center;
  cursor:pointer;
  color:#888;
  transition:.3s;
}

.eyeButton:hover{
  color:#b68d40;
}

/* ========================= */
/* OPTIONS */
/* ========================= */

.options{
  margin:8px 0 30px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.options label{
  display:flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  color:#555;
  font-size:14px;
}

.options input{
  accent-color:#b68d40;
}

.forgot{
  background:none;
  border:none;
  color:#b68d40;
  cursor:pointer;
  font-weight:600;
  transition:.3s;
}

.forgot:hover{
  color:#8f6d2d;
}

/* ========================= */
/* BUTTON */
/* ========================= */

.loginButton{
  width:100%;
  height:58px;
  border:none;
  border-radius:4px;
  cursor:pointer;
  background:linear-gradient(
      135deg,
      #c69d4d,
      #b68d40,
      #8d6a29
  );
  color:#fff;
  font-size:16px;
  font-weight:500;
  transition:.35s;
  box-shadow:0 18px 35px rgba(182,141,64,.28);
}

.loginButton:hover{
  transform:translateY(-3px);
  box-shadow:0 25px 45px rgba(182,141,64,.35);
}

.loginButton:active{
  transform:scale(.98);
}

.powered{
  margin-top:30px;
  text-align:center;
  color:#888;
  font-size:13px;
}

.powered strong{
  color:#b68d40;
}

/* ========================= */
/* ANIMATIONS */
/* ========================= */

@keyframes fadeLeft{

  from{
    opacity:0;
    transform:translateX(-60px);
  }

  to{
    opacity:1;
    transform:none;
  }

}

@keyframes fadeRight{

  from{
    opacity:0;
    transform:translateX(60px);
  }

  to{
    opacity:1;
    transform:none;
  }

}

/* ========================= */
/* RESPONSIVE */
/* ========================= */

@media(max-width:992px){

.loginPage{
grid-template-columns:1fr;
}

.leftSide{
height:320px;
}

.leftContent{
left:40px;
bottom:40px;
}

.leftContent h1{
font-size:54px;
}

.leftContent h2{
font-size:30px;
}

.rightSide{
padding:40px 20px;
}

.loginCard{
padding:40px 28px;
}

}

@media(max-width:576px){

.leftSide{
height:260px;
}

.leftContent{
left:24px;
bottom:24px;
}

.leftContent h1{
font-size:42px;
}

.leftContent h2{
font-size:24px;
}

.leftContent p{
font-size:14px;
line-height:1.7;
}

.loginCard{
padding:30px 22px;
border-radius:18px;
}

.loginCard h3{
font-size:30px;
}

.logoCircle{
width:80px;
height:80px;
}

.options{
flex-direction:column;
align-items:flex-start;
gap:15px;
}

}
`}</style>

  </>
);
}