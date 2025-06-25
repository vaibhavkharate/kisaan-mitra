import React from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700">{t("welcome")}</h1>
      <p className="text-lg mt-2">{t("weather")}</p>
    </div>
  );
};

export default Home;
