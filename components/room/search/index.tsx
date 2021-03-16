import Header from "components/header";
import { format } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import palette from "styles/palette";
import { ImMap2 } from "react-icons/im";
import { useSelector } from "store";
import { useDispatch } from "react-redux";
import { commonActions } from "store/common";
import dynamic from "next/dynamic";
import RoomList from "./RoomList";
import Filter from "./filter";

const SearchMap = dynamic(() => import("./SearchMap"), { ssr: false });

const Container = styled.div`
  display: flex;
`;

const ListContainer = styled.div<{ showMap: boolean }>`
  width: 100vw;
  padding: 50px 80px;
  display: flex;
  flex-direction: column;
  ${({ showMap }) =>
    showMap
      ? css`
          width: 55vw;
          padding: 50px 24px;
        `
      : css`
          min-height: calc(100vh - 80px);
        `}
`;

const Info = styled.div`
  font-weight: 300;
  font-size: 15px;
`;

const Title = styled.div`
  font-weight: 500;
  margin-top: 10px;
  font-size: 30px;
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0px;
`;

const ShowMap = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 15px;
  border-radius: 10px;
  svg {
    margin-right: 5px;
  }
  &:hover {
    background-color: ${palette.gray_f7};
  }
  cursor: pointer;
  font-weight: 300;
  font-size: 15px;
`;

const Alert = styled.div`
  font-weight: 300;
  font-size: 15px;
  padding-bottom: 15px;
`;

const SearchResults = () => {
  const showMap = useSelector((state) => state.common.showMap);
  const originalLength = useSelector(
    (state) => state.room.search.originalLength
  );
  const dispatch = useDispatch();
  const { query } = useRouter();

  useEffect(() => {
    dispatch(commonActions.setShowMiniSearchBar(true));
    dispatch(commonActions.setShowSearchBar(false));
  }, []);

  const searchInfo = `${originalLength}개의 숙소 
  ${
    query.checkIn &&
    query.checkOut &&
    `· ${format(new Date(query.checkIn as string), "MM월 dd일")} - ${format(
      new Date(query.checkOut as string),
      "MM월 dd일"
    )}`
  } · 게스트 ${Number(query.adults) + Number(query.children)}명`;

  return (
    <>
      <Head>
        <title>{query.value} · 숙소 · Airbnb</title>
      </Head>
      <Header />
      <Container>
        <ListContainer showMap={showMap}>
          <div>
            <Info>{searchInfo}</Info>
            <Title>{query.value}</Title>
            <Options>
              <Filter />
              <ShowMap
                onClick={() => dispatch(commonActions.setShowMap(!showMap))}
              >
                <ImMap2 size={16} />
                {showMap ? "지도 숨기기" : "지도 표시하기"}
              </ShowMap>
            </Options>
            {!query.checkIn && !query.checkOut && (
              <Alert>
                여행 날짜를 입력하면 1박당 총 요금을 확인할 수 있습니다.
              </Alert>
            )}
          </div>
          <RoomList />
        </ListContainer>
        {showMap && <SearchMap />}
      </Container>
    </>
  );
};

export default SearchResults;
