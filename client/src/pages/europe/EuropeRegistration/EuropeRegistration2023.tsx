/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from "react";
import { Button, Box, Stack, Typography, IconButton } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router";
import { globalData } from "utils/GlobalData";
import axios from "axios";
import usePageViews from "hooks/usePageViews";
import { useAuthState, useAuthDispatch } from "context/AuthContext";
import TopCenterSnackBar from "components/TopCenterSnackBar/TopCenterSnackBar";
import { RegistrationContainer } from "pages/common/Registration/RegistrationStyles";
import LandingSection from "components/Section/LandingSection";
import Loading from "components/Loading/Loading";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useNSSType from "hooks/useNSSType";
import {
  smallFontSize,
  headingFontSize,
  subHeadingFontSize,
} from "utils/FontSize";
import NSSButton from "components/Button/NSSButton";
import MarketoForm from "components/MarketoForm/MarketoForm";
import dayjs from "dayjs";
import useCurrentYear from "hooks/useCurrentYear";

type TFN = 1 | 0 | -1;

interface props {
  isStudent?: boolean;
  init?: boolean;
}

const studentFee = 90;
const notStudentFee = 150;
// 정액 할인
const earlyBirdDiscount = 30;

const EuropeRegistration2023 = ({ isStudent = false, init = false }: props) => {
  const pathname = usePageViews();
  const currentYear = useCurrentYear();
  const nssType = useNSSType();
  const isEarlyBird = new Date() < new Date("2023-06-01 00:00:00+2");

  // stage
  // const [stage, setStage] = useState<number>(1);

  // 등록비
  const [registrationFee, setRegistrationFee] = useState<number>(
    isStudent ? studentFee : notStudentFee,
  );
  const finalFee =
    isEarlyBird && window.location.href.indexOf("/early") !== -1
      ? registrationFee - earlyBirdDiscount
      : registrationFee;

  //
  const [checkout, setCheckout] = useState<boolean>(false);
  const [mktoLoading, setMktoLoading] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<TFN>(-1);
  const navigate = useNavigate();
  const nation = usePageViews();

  const authState = useAuthState();
  const dispatch = useAuthDispatch();

  const {
    goNextText,
    logoURL,
    registrationStep1Label,
    registrationStep2Label,
    registrationStep3Label,
    registrationTitle,
    registrationDesc,
  } = globalData.get(nssType) as Common.globalDataType;

  // alert
  const [emailNotValidAlert, setEmailNotValidAlert] = useState<boolean>(false);

  const dispatchLogin = (e: string, r: string, t: string) =>
    dispatch({
      type: "LOGIN",
      authState: {
        ...authState,
        isLogin: true,
        role: r,
        email: e,
        accessToken: t,
      },
    });

  // const clickFeeHandler = (fee: string) => {
  //   setRegistrationFee(fee);
  // setStage(2);
  // };

  useEffect(() => {
    setMktoLoading(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.MktoForms2.loadForm(
      "//pages.parksystems.com",
      "988-FTP-549",
      1149,
      (form: any) => {
        document.querySelector(".mktoButton[type='submit']")?.remove();

        setMktoLoading(false);

        // validation 끼워넣기
        const validationDiv = document.createElement("div");
        validationDiv.className = "validation-msg";
        document
          .querySelector("#LblEmail")
          ?.parentElement?.appendChild(validationDiv);

        // 체크박스 layout 변경
        const check1 = document.querySelector("#LblpsmktOptin")?.parentElement;
        const check2 = document.querySelector("#LblpsOptin")?.parentElement;
        check1?.classList.add("flex-reverse");
        check2?.classList.add("flex-reverse");

        // validation & 중복체크
        document
          .querySelector("input#Email")
          ?.addEventListener("focusout", async (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (
              target.value.indexOf("@") === -1 &&
              target.value.indexOf(".") === -1
            ) {
              setEmailValid(0);
            } else {
              try {
                const res = await axios.post("/api/users/checkemail", {
                  email: target.value,
                  nation,
                  year: currentYear,
                });
                setEmailValid(!res.data.result ? 1 : 0);
              } catch (err) {
                console.log(err);
              }
            }
          });
      },
    );
  }, []);
  // }, [stage]);
  // 마케토폼 2개 렌더링 될 시 refresh
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (document.querySelectorAll("#LblpsOptin").length > 2) {
  //       navigate(0);
  //     }
  //   }, 1000);
  // }, [mktoLoading]);

  useEffect(() => {
    if (document.querySelector(".validation-msg") !== null) {
      const validationDOM = document.querySelector(
        ".validation-msg",
      ) as HTMLParagraphElement;
      if (emailValid === 1) {
        validationDOM.classList.add("valid");
        validationDOM.classList.remove("invalid");
        validationDOM.innerText = "Valid Email!";
      } else if (emailValid === 0) {
        validationDOM.classList.add("invalid");
        validationDOM.classList.remove("valid");
        validationDOM.innerText = "Invalid or duplicate email.";
      }
    }
  }, [emailValid]);

  useEffect(() => {
    if (!isEarlyBird && window.location.href.indexOf("/early") !== -1) {
      window.location.replace(window.location.href.replace("/early", ""));
    }
  }, []);

  return (
    <>
      {/* {mktoLoading && <Loading />} */}
      <RegistrationContainer>
        <LandingSection className="banner" maxWidth="1920px" fullWidth>
          <Stack justifyContent="center" alignItems="center" height="100%">
            <img className="banner-img" src={logoURL} alt="NSS Logo" />
          </Stack>
        </LandingSection>

        {init && (
          <Stack className="layout body-fit-banner">
            <Box className="text-center" mb={5}>
              <Typography fontSize={headingFontSize} mb={1}>
                Registration
              </Typography>
            </Box>
            {isEarlyBird && (
              <Box sx={{ mb: 5 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  Early Bird Special – valid until May 31st, 2023
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      tablet: "row",
                      mobile: "column",
                    },
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    className="registration-fee-container"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography textAlign="center" color="white">
                      €
                      {isEarlyBird
                        ? studentFee - earlyBirdDiscount
                        : studentFee}
                    </Typography>
                    <Typography textAlign="center" color="white">
                      Student
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={() => {
                        navigate("student/early");
                        // clickFeeHandler("20");
                        // clickFeeHandler("1");
                        // setIsStudent(true);
                      }}
                    >
                      Register
                    </Button>
                  </Stack>
                  <Stack
                    className="registration-fee-container"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography textAlign="center" color="white">
                      €
                      {isEarlyBird
                        ? notStudentFee - earlyBirdDiscount
                        : notStudentFee}
                    </Typography>
                    <Typography textAlign="center" color="white">
                      Profs, PhDs and Industry
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={() => {
                        navigate("postdoc/early");
                        // clickFeeHandler("35");
                        // setIsStudent(false);
                      }}
                    >
                      Register
                    </Button>
                  </Stack>
                </Box>
              </Box>
            )}
            <Box sx={{ mb: 5 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Regular Rates – valid from June 1st, 2023
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    tablet: "row",
                    mobile: "column",
                  },
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack
                  className="registration-fee-container"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography textAlign="center" color="white">
                    €{studentFee}
                  </Typography>
                  <Typography textAlign="center" color="white">
                    Student
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    onClick={() => {
                      navigate("student");
                      // clickFeeHandler("20");
                      // clickFeeHandler("1");
                      // setIsStudent(true);
                    }}
                  >
                    Register
                  </Button>
                </Stack>
                <Stack
                  className="registration-fee-container"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography textAlign="center" color="white">
                    €{notStudentFee}
                  </Typography>
                  <Typography textAlign="center" color="white">
                    Profs, PhDs and Industry
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    onClick={() => {
                      navigate("postdoc");
                      // clickFeeHandler("35");
                      // setIsStudent(false);
                    }}
                  >
                    Register
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Stack>
        )}
        {!init && (
          <LandingSection className="layout body-fit">
            <Stack
              className="step-container"
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <div>
                <LooksOneIcon className="step-icon active" />
                <Typography
                  className="step-caption active"
                  fontSize={smallFontSize}
                  sx={{ position: "absolute" }}
                >
                  {registrationStep1Label || "Your Information"}
                </Typography>
              </div>
              <div className="icon-divider" />
              <div>
                <LooksTwoIcon className="step-icon" />
                <Typography
                  className="step-caption caption2"
                  fontSize={smallFontSize}
                  sx={{ position: "absolute" }}
                >
                  {registrationStep2Label || "Setting a password"}
                </Typography>
              </div>
              <div className="icon-divider" />
              <div>
                <Looks3Icon className="step-icon" />
                <Typography
                  className="step-caption"
                  fontSize={smallFontSize}
                  sx={{ position: "absolute" }}
                >
                  {registrationStep3Label || "Complete"}
                </Typography>
              </div>
            </Stack>
            <IconButton
              onClick={() => {
                // setStage(1);
                navigate(`/eu/${currentYear}/registration`);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            {!init && <MarketoForm formId="1149" />}
            <Typography textAlign="right" fontWeight={700}>
              Registration Fee: €{finalFee} {isEarlyBird && "(Early Bird Rate)"}
            </Typography>
            {!mktoLoading && !checkout && (
              <NSSButton
                variant="gradient"
                className="mktoButton2"
                onClick={() => {
                  if (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    !window.MktoForms2.allForms()[
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      window.MktoForms2.allForms().length - 1
                    ]?.validate()
                  ) {
                    // 마케토 validator가 알려줌
                  } else if (emailValid !== 1) {
                    setEmailNotValidAlert(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    setCheckout(true);
                  }
                }}
              >
                CHECKOUT
              </NSSButton>
            )}
            {checkout && (
              <div className="paypal-container">
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    currency: "EUR",
                  }}
                >
                  <PayPalButtons
                    style={{ color: "blue" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: `${finalFee}`,
                            },
                          },
                        ],
                      });
                    }}
                    onError={(err) => {
                      console.log(err);

                      alert("Paypal Module Error. Please try again later.");
                    }}
                    onApprove={async (data, actions) => {
                      const result = actions?.order
                        ?.capture()
                        .then(async (details) => {
                          // snackBar?

                          const formData =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            window.MktoForms2.allForms()[
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              window.MktoForms2.allForms().length - 1
                            ].getValues();
                          try {
                            // user db submit
                            const regResponse = await axios.post(
                              "/api/users/register",
                              {
                                title: formData.Salutation,
                                firstName: formData.FirstName,
                                lastName: formData.LastName,
                                email: formData.Email,
                                phone: formData.Phone,
                                institute: formData.Company,
                                department: formData.Department,
                                country: formData.Country,
                                state: formData.State,
                                nation,
                                isStudent,
                                year: currentYear,
                              },
                            );

                            // save transaction to db
                            await axios.post("/api/page/eu/transaction", {
                              details,
                              userId: regResponse.data.id,
                            });

                            // marketo submit
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            window.MktoForms2.allForms()
                              [
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                window.MktoForms2.allForms().length - 1
                              ].submit()
                              .onSuccess(() => {
                                console.log("mkto success");
                                return false;
                              });
                            try {
                              const res = await axios.post("/api/users/login", {
                                nation,
                                email: formData.Email,
                                password: null,
                                year: currentYear,
                              });
                              if (res.data.success) {
                                dispatchLogin(
                                  formData.Email,
                                  res.data.role,
                                  res.data.accessToken,
                                );
                              }
                              navigate(
                                `/${nation}/${currentYear}/user/reset-password`,
                              );
                            } catch (err) {
                              console.log(err);
                              alert("login failed");
                            }
                          } catch (err) {
                            console.log(err);
                            alert("error: saving user data. Please try again.");
                          }
                          // });
                        });
                      return result;
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </LandingSection>
        )}

        <TopCenterSnackBar
          value={emailNotValidAlert}
          setValue={setEmailNotValidAlert}
          severity="warning"
          content="Email already exists or not valid."
          variant="filled"
        />
      </RegistrationContainer>
    </>
  );
};

export default EuropeRegistration2023;
