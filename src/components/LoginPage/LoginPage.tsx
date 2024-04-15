import { FC, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { AuthContext } from "../../providers/authContext";

import "./styles.css";
import "react-toastify/dist/ReactToastify.css";

import Button from "react-bootstrap/Button";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  isLogin?: boolean;
}

export const LoginPage: FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { signUp, signIn, signInViaGoogle,} =
    useContext(AuthContext);

  const notify = (text: string) => {
    if (!toast.isActive("error")) {
      toast.error(text, { toastId: "error" });
    }
  };

  const checkValidation = useCallback(() => {
    if (email.length === 0) {
      notify("Email is required");
      return false;
    }

    if (password.length < 6) {
      notify("Password is required, minimum 6 characters");
      return false;
    }

    return true;
  }, [email, password]);

  const handelRegister = useCallback(async () => {
    if (!checkValidation()) return;
    const result = await signUp(email, password, userName);

    if (result) {
      navigate("/home");
    }
  }, [checkValidation, email, navigate, password, signUp, userName]);

  const handelLogin = useCallback(async () => {
    if (!checkValidation()) return;
    const result = await signIn(email, password);

    if (result) {
      navigate("/home");
    }
  }, [checkValidation, email, navigate, password, signIn]);

  const handleLoginWithGoogle = useCallback(async () => {
    const result = await signInViaGoogle();

    if (result) {
      navigate("/home");
    }
  }, [navigate, signInViaGoogle]);

  return (
    <>
      <div className="sidenav">
        <div className="login-main-text">
          <h2>
            Application
            <br /> Login Page
          </h2>
          <p>Login or register from here to access.</p>
        </div>
      </div>
      <div className="main">
        <div className="col-md-6 col-sm-12">
          <div className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="User Name"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => handleLoginWithGoogle()}
              className="mt-1 w-100"
            >
              Login with Google
            </Button>
            <div className="col d-flex row-xs-12 justify-content-around mt-2">
              <Button
                variant="dark"
                className="w-25"
                onClick={() => handelLogin()}
              >
                Login
              </Button>
              <Button
                variant="secondary"
                className="w-25"
                onClick={() => handelRegister()}
              >
                Register
              </Button>{" "}
            </div>
          </div>
          <ToastContainer
            closeOnClick
            autoClose={2000}
            limit={1}
            pauseOnHover={false}
          />
        </div>
      </div>
    </>
  );
};
