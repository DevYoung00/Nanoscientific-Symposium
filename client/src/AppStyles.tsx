import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

export const AppContainer = styled.div`
  background-color: ${() => {
    const theme = useTheme();
    return theme.palette.background.default;
  }};
  font-family: ${() => {
    const theme = useTheme();
    return theme.typography.body1.fontFamily;
  }};
  color: ${() => {
    const theme = useTheme();
    return theme.palette.text.primary;
  }};

  a {
    color: ${() => {
      const theme = useTheme();
      return theme.palette.text.secondary;
    }};
    transition: color 0.2s ease-in-out;
    display: inline-block;

    &:hover {
      color: ${() => {
        const theme = useTheme();
        return theme.palette.text.primary;
      }};
    }

    &.link-white {
      color: white;
      &:hover {
        color: ${() => {
          const theme = useTheme();
          return theme.palette.primary.main;
        }};
      }
    }
  }

  .hover-zoom {
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(105%);
    }
  }

  .z0 {
    z-index: 0;
  }
  .z1 {
    z-index: 1;
  }

  .layout {
    margin: 0 auto;
    padding: 70px 50px;
    box-sizing: border-box;
  }

  .body-fit {
    min-height: calc(100vh - 64px);
  }

  @media screen and (min-width: 0px) {
    .layout {
      padding: 35px;
    }

    a {
      padding: 10px 5px;
    }
  }
  @media screen and (min-width: 1024px) {
    .layout {
      padding: 70px 50px;
      max-width: 1024px;
    }
    a {
      padding: 15px 10px;
    }
  }
  @media screen and (min-width: 1921px) {
    .layout {
      padding: 70px 50px;
      max-width: 1680px;
    }
    a {
      padding: 15px 10px;
    }
  }
`;
