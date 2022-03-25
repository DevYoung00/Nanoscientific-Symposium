import React, { useState, useEffect } from "react";
import axios from "axios";
import { VideoContainer } from "components/VideoContainer/VideoContainer";
import { Box, Button, Skeleton, Stack } from "@mui/material";
import ZoomCard from "components/ZoomCard/ZoomCard";
import { StyledTimezoneSelect } from "components/Programs/ProgramsListContainer";
import usePageViews from "hooks/usePageViews";
import { calculateDurationToDate } from "utils/Date";
import useSeoTitle from "hooks/useSeoTitle";
import { globalData } from "utils/GlobalData";

const LectureHall = () => {
  const pathname = usePageViews();
  // seo
  const { lectureHall } = globalData.get(pathname) as Common.globalDataType;
  useSeoTitle(lectureHall as string, pathname);

  // 국가에 해당하는 모든 webinars
  const [webinarList, setWebinarList] = useState<Webinar.webinarType[]>([]);
  // 국가에 해당하는 live중인 webinars
  const [liveWebinarList, setLiveWebinarList] = useState<Webinar.webinarType[]>(
    [],
  );
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  // getWebinar 로딩
  const [getWebinarLoading, setGetWebinarLoading] = useState<boolean>(false);

  const getWebinars = async () => {
    setGetWebinarLoading(true);
    axios
      .get("/api/zoom/webinar/list")
      .then((res) => {
        // const upcomingWebinars = filterPreviousWebinars(
        //   res.data.result.webinars,
        // );
        // setWebinarList(upcomingWebinars);
        const upcomingWebinars = filterPreviousWebinars(
          filterWebinarsByTag(res.data.result.webinars, pathname),
        );
        setWebinarList(upcomingWebinars);
        // setWebinarList(res.data.result.webinars);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setGetWebinarLoading(false);
      });
  };

  const filterPreviousWebinars = (webinars: Webinar.webinarType[]) => {
    const filtered = webinars.filter(
      (webinar: Webinar.webinarType) =>
        calculateDurationToDate(webinar.start_time, webinar.duration) >
        new Date(),
    );
    return filtered;
  };

  // 현재 진행중 Webinar을 state에 저장하는 메서드
  const filterLiveWebinars = () => {
    const filtered = webinarList.filter(
      (webinar: Webinar.webinarType) =>
        new Date(webinar.start_time) <= new Date() &&
        new Date() <=
          calculateDurationToDate(webinar.start_time, webinar.duration),
    );

    setLiveWebinarList(filtered);
  };

  const filterWebinarsByTag = (
    webinars: Webinar.webinarType[],
    tag: string,
  ) => {
    const filtered = webinars.filter(
      (webinar: Webinar.webinarType) =>
        webinar.topic.toLowerCase().indexOf(tag.toLowerCase()) !== -1,
    );
    return filtered;
  };

  useEffect(() => {
    getWebinars();
  }, []);
  useEffect(() => {
    filterLiveWebinars();
  }, [webinarList]);

  return (
    <VideoContainer>
      {/* {getWebinarLoading && <Loading />} */}
      <video
        src="https://d25unujvh7ui3r.cloudfront.net/lecture_hall.mp4"
        muted
        autoPlay
        loop
        playsInline
        style={{ position: "absolute" }}
      />
      <Stack
        direction="column"
        sx={{
          py: "100px",
          mx: "auto",
          maxWidth: "1080px",
          zIndex: 1,
        }}
      >
        <StyledTimezoneSelect
          value={selectedTimezone}
          onChange={(e) => {
            setSelectedTimezone(e.value);
          }}
        />
        <Stack
          sx={{
            zIndex: 1,
            mt: 2,
            ml: {
              mobile: "auto",
              tablet: 8,
            },
            mr: {
              mobile: "auto",
              tablet: 0,
            },
            flexDirection: {
              mobile: "column",
              tablet: "row",
            },
            maxHeight: "650px",
            overflowY: "auto",
            overflowX: "hidden",
            width: {
              mobile: "330px",
              tablet: "auto",
            },
            flexWrap: {
              mobile: "nowrap",
              tablet: "wrap",
            },
            position: "relative",
            left: "13px",
          }}
        >
          {/* skeleton */}
          {getWebinarLoading && (
            <>
              <Stack
                sx={{ width: "300px", height: "220px", mr: 3 }}
                direction="column"
                justifyContent="space-between"
              >
                <Stack
                  sx={{ height: "90px", p: 2 }}
                  direction="column"
                  justifyContent="center"
                >
                  <Skeleton width="60%" />
                  <Skeleton />
                </Stack>
                <Skeleton variant="rectangular" height={130} />
              </Stack>
              <Stack
                sx={{ width: "300px", height: "220px", mr: 3 }}
                direction="column"
                justifyContent="space-between"
              >
                <Stack
                  sx={{ height: "90px", p: 2 }}
                  direction="column"
                  justifyContent="center"
                >
                  <Skeleton width="60%" />
                  <Skeleton />
                </Stack>
                <Skeleton variant="rectangular" height={130} />
              </Stack>
              <Stack
                sx={{ width: "300px", height: "220px" }}
                direction="column"
                justifyContent="space-between"
              >
                <Stack
                  sx={{ height: "90px", p: 2 }}
                  direction="column"
                  justifyContent="center"
                >
                  <Skeleton width="60%" />
                  <Skeleton />
                </Stack>
                <Skeleton variant="rectangular" height={130} />
              </Stack>
            </>
          )}
          {webinarList.map((webinar) => (
            <ZoomCard
              key={webinar.id}
              webinar={webinar}
              timezone={selectedTimezone}
              isOnAir={
                liveWebinarList.filter(
                  (liveWebinar) => webinar.id === liveWebinar.id,
                ).length !== 0
              }
            />
          ))}
        </Stack>
      </Stack>
    </VideoContainer>
  );
};

export default LectureHall;