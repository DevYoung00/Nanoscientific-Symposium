import React, { useState, useEffect } from "react";
import axios from "axios";
import Title from "components/Title/Title";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useInput from "hooks/useInput";
import TopCenterSnackBar from "components/TopCenterSnackBar/TopCenterSnackBar";
import { useAuthState } from "context/AuthContext";
import usePageViews from "hooks/usePageViews";
import { useNavigate } from "react-router";
import { ResetPasswordContainer } from "./ResetPasswordStyles";

const inputBoxStyle = {
  backgroundColor: "#fff",
  boxShadow: "2px 2px 2px #0000001c",

  padding: "10px 30px",
};

const ResetPassword = () => {
  const authState = useAuthState();
  const pathname = usePageViews();
  const navigate = useNavigate();

  const curPassword = useInput("");
  const password1 = useInput("");
  const password2 = useInput("");

  // state
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState<boolean>(false);
  // 유저 패스워드 설정 여부
  const [isUserPasswordSet, setIsUserPasswordSet] = useState<boolean>(false);

  // alert 관련 state
  const [passwordSetSuccessAlert, setPasswordSetSuccessAlert] =
    useState<boolean>(false);
  const [tokenNotMatchAlert, setTokenNotMatchAlert] = useState<boolean>(false);
  const [currentPasswordNotMatchAlert, setCurrentPasswordNotMatchAlert] =
    useState<boolean>(false);
  const [emptyAlert, setEmptyAlert] = useState<boolean>(false);
  const [passwordNotMatchAlert, setPasswordNotMatchAlert] =
    useState<boolean>(false);

  const passwordSetHandler = () => {
    if (passwordNotMatch) {
      setPasswordNotMatchAlert(true);
      return;
    }
    if (
      (isUserPasswordSet && curPassword.value === "") ||
      password1.value === "" ||
      password2.value === ""
    ) {
      setEmptyAlert(true);
      return;
    }

    setLoading(true);
    axios
      .post("/api/users/passwordreset", {
        token: authState.accessToken,
        curPassword: curPassword.value,
        newPassword: password1.value,
        nation: pathname,
      })
      .then((res) => {
        if (res.data.success) {
          setPasswordSetSuccessAlert(true);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        } else {
          switch (res.data.code) {
            case "T40":
            case "T41":
              setTokenNotMatchAlert(true);
              setTimeout(() => {
                navigate(0);
              }, 1500);
              break;
            // case "P40":
            default:
              setCurrentPasswordNotMatchAlert(true);
              break;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePasswordConfirm = () => {
    if (password1.value !== password2.value) {
      setPasswordNotMatch(true);
    } else {
      setPasswordNotMatch(false);
    }
  };

  useEffect(() => {
    handlePasswordConfirm();
  }, [password1, password2]);

  useEffect(() => {
    axios
      .post("/api/users/passwordset/check", {
        nation: pathname,
        email: authState.email,
      })
      .then((res) => {
        setIsUserPasswordSet(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <ResetPasswordContainer>
        <Title fontSize={25} title="Reset Your Password" />
        <Box sx={inputBoxStyle}>
          {isUserPasswordSet && (
            <TextField
              autoFocus
              margin="dense"
              id="curPassword"
              label="Current Password"
              type="password"
              fullWidth
              variant="standard"
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter") {
                  passwordSetHandler();
                }
              }}
              {...curPassword}
            />
          )}
          <TextField
            margin="dense"
            id="password1"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter") {
                passwordSetHandler();
              }
            }}
            {...password1}
          />
          <TextField
            margin="dense"
            id="password2"
            label="New Password Confirmation"
            type="password"
            fullWidth
            variant="standard"
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter") {
                passwordSetHandler();
              }
            }}
            {...password2}
          />
          <span style={{ color: passwordNotMatch ? "red" : "green" }}>
            {passwordNotMatch ? "Password is not matched." : <div>&nbsp;</div>}
          </span>
          <Box
            sx={{
              display: "flex",
              flexDirection: { mobile: "column", tablet: "row" },
              justifyContent: { mobile: "flex-start", tablet: "space-between" },
            }}
          >
            {/* <TextField
              className="half-width"
              autoFocus
              margin="dense"
              id="first-name"
              label="First Name"
              type="text"
              variant="standard"
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter") {
                  passwordSetHandler();
                }
              }}
              {...firstName}
            />
            <TextField
              className="half-width"
              autoFocus
              margin="dense"
              id="last-name"
              label="Last Name"
              type="text"
              variant="standard"
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter") {
                  passwordSetHandler();
                }
              }}
              {...lastName}
            /> */}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LoadingButton
              loading={loading}
              style={{
                margin: "40px 20px",
                borderRadius: "30px",
                width: "100%",
              }}
              variant="contained"
              color="primary"
              onClick={passwordSetHandler}
            >
              SUBMIT
            </LoadingButton>
          </Box>
        </Box>
      </ResetPasswordContainer>
      {/* 비밀번호 변경 성공 alert */}
      <TopCenterSnackBar
        value={passwordSetSuccessAlert}
        setValue={setPasswordSetSuccessAlert}
        variant="filled"
        severity="success"
        content="Password successfully changed."
      />
      {/* 비밀번호 확인 alert */}
      <TopCenterSnackBar
        value={passwordNotMatchAlert}
        setValue={setPasswordNotMatchAlert}
        variant="filled"
        severity="error"
        content="Password not match."
      />
      {/* 빈 field alert */}
      <TopCenterSnackBar
        value={emptyAlert}
        setValue={setEmptyAlert}
        variant="filled"
        severity="error"
        content="Please fill all fields."
      />
      {/* 현재 비밀번호 불일치 alert */}
      <TopCenterSnackBar
        value={currentPasswordNotMatchAlert}
        setValue={setCurrentPasswordNotMatchAlert}
        variant="filled"
        severity="warning"
        content="Current password not matched."
      />
      {/* 토큰 만료 alert */}
      <TopCenterSnackBar
        value={tokenNotMatchAlert}
        setValue={setTokenNotMatchAlert}
        variant="filled"
        severity="error"
        content="Token expired."
      />
    </>
  );
};

export default ResetPassword;