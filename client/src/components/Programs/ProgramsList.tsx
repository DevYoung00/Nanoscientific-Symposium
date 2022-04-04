import React, { useEffect, useState } from "react";
import axios from "axios";
import usePageViews from "hooks/usePageViews";
import Loading from "components/Loading/Loading";

import { Table, TableContainer, TableBody } from "@mui/material";
import {
  ProgramsListContainer,
  StyledTimezoneSelect,
  SessionContainer,
} from "./ProgramsListContainer";
import ProgramContent from "./ProgramContent/ProgramContent";
import ProgramTitle from "./ProgramTitle/ProgramTitle";

const ProgramsList = () => {
  const pathname = usePageViews();
  const [programs, setPrograms] = useState<Program.programType[]>([]);
  const [programAgenda, setProgramAgenda] = useState<
    Program.programAgendaType[]
  >([]);
  const [sessions, setSessions] = useState<Program.sessionType[]>([]);
  const [programLoading, setProgramLoading] = useState<boolean>(false);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const config = {
    params: {
      nation: pathname,
    },
  };
  useEffect(() => {
    const getPrograms = async () => {
      setProgramLoading(true);
      const programs = await axios.get(`/api/page/common/programs`, config);
      setPrograms(programs.data);
      setProgramLoading(false);
    };

    const getProgramAgenda = async () => {
      setProgramLoading(true);
      const result = await axios.get(
        `/api/page/common/programs/agenda`,
        config,
      );
      const agendaList = result.data.data;
      const sorted = agendaList
        .sort(
          (aa: Program.programAgendaType, bb: Program.programAgendaType) => {
            if (aa.next_id === bb.id) return -1;
            if (aa.next_id !== bb.id || aa.next_id === 9999) return 1;
            return 0;
          },
        )
        .sort(
          (aa: Program.programAgendaType, bb: Program.programAgendaType) => {
            if (aa.program_id >= bb.program_id) return 1;
            return 0;
          },
        );
      setProgramAgenda(sorted);
      setProgramLoading(false);
    };

    getPrograms();
    getProgramAgenda();
  }, []);

  useEffect(() => {
    // 세션 가져오기
    const getSessions = async () => {
      setSessionLoading(true);
      const sessions = await axios.get(`/api/page/common/sessions`, config);
      setSessions(sessions.data);
      setSessionLoading(false);
    };

    getSessions();
  }, []);

  if (programLoading || sessionLoading) {
    return <Loading />;
  }

  return (
    <ProgramsListContainer className="layout body-fit">
      <StyledTimezoneSelect
        value={selectedTimezone}
        onChange={(e) => {
          setSelectedTimezone(e.value);
        }}
      />
      {sessions.map((session) => {
        return (
          <TableContainer key={session.id} sx={{ overflowX: "hidden", mb: 8 }}>
            <ProgramTitle
              title={session.session_title}
              timezone={selectedTimezone}
              date={session.date}
            />
            <Table sx={{ width: "100%" }}>
              <TableBody>
                {programs
                  .filter((program) => {
                    return program.session === session.id;
                  })
                  .map((program, index) => (
                    <ProgramContent
                      selectedTimezone={selectedTimezone}
                      isAdmin={false}
                      key={program.id}
                      {...program}
                      index={index}
                      programAgenda={programAgenda}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </ProgramsListContainer>
  );
};

export default ProgramsList;
