import React from "react";
import Head from "next/head";
import { wrapper } from "store";
import { GetServerSideProps, NextPage } from "next";
import { commonActions } from "store/common";
import { searchActions } from "store/search";
import dynamic from "next/dynamic";
import Header from "components/header";
import Home from "components/home";

const Error = dynamic(() => import("./_error"));

interface Props {
  error?: number | null;
}

const home: NextPage<Props> = ({ error }) => {
  if (error) return <Error statusCode={error} />;
  return (
    <>
      <Head>
        <title>홈 – 에어비앤비</title>
      </Head>
      <Header />
      <Home />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async ({ store }) => {
    try {
      store.dispatch(commonActions.setShowMiniSearchBar(false));
      store.dispatch(commonActions.setShowSearchBar(true));
      store.dispatch(searchActions.initSearch());
      return { props: { error: null } };
    } catch (error) {
      return { props: { error: error.response.status } };
    }
  }
);

export default home;
