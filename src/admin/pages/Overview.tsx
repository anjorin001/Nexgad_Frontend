import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import api from "../../utils/api";
import { useToast } from "../../utils/ToastNotification";
import {
  AnalyticsMetrics,
  type IrawMetricsData,
} from "../components/AnalyiticComponent";
import { ChartAreaInteractive, type IChartRawData } from "../components/Chart";

const DashBoard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rawMetricsData, setRawMetricsData] = useState<IrawMetricsData | null>(
    null
  );
  const [chartRawData, setChartRawData] = useState<IChartRawData[] | null>(
    null
  );
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const toast = useToast();
  console.log("1");

  const getOverviewMetrics = async () => {
    setIsLoading(true);
    console.log("loading fetch");
    try {
      const [metricsRes, chartRes] = await Promise.all([
        api.get("/order/metrics"),
        api.get("/order/chart-data"),
      ]);

      console.log("metrics", metricsRes.data.data);
      console.log("chartdARA", chartRes.data.data);

      setRawMetricsData(metricsRes.data.data);
      setChartRawData(chartRes.data.data);
    } catch (err: any) {
      console.error("Error sending reset token:", err);

      if (err.response) {
        if (err.response.message === "Unauthorized") {
          toast.error("Unauthorized Access");
          navigate("/login");
          return;
        }
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("", "Login to access your admin dashboard");
      return;
    }
    getOverviewMetrics();
  }, []);

  return (
    <>
      <AnalyticsMetrics rawMetricsData={rawMetricsData} isLoading={isLoading} />
      <ChartAreaInteractive chartRawData={chartRawData} isLoading={isLoading} />
    </>
  );
};

export default DashBoard;
