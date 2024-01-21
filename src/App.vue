<template>
  <main>
    <Line id="mood-tracker-chart" :options="chartOptions" :data="chartData" />
  </main>
</template>

<script setup lang="ts">
import "the-new-css-reset/css/reset.css";

import axiosInstance from "./helpers/axiosInstance";

import { Ref, ref, watch } from "vue";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface iVizTracker {
  date: string;
  mood: number;
  habit: number;
}

interface iDataSet {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
  tension?: number;
}

interface iChartData {
  labels: string[];
  datasets: iDataSet[];
}

const tracker: Ref<iVizTracker[]> = ref([]);

const computeChartData = (): iChartData => {
  return {
    labels: tracker.value.map((mood) => mood.date),
    datasets: [
      {
        label: "Mood",
        backgroundColor: "#57cc99",
        borderColor: "#57cc99",
        fill: true,
        data: tracker.value.map((data) => data.mood),
        tension: 0.32,
      },
      {
        label: "Habit",
        backgroundColor: "#e29578",
        borderColor: "#e29578",
        fill: true,
        data: tracker.value.map((data) => data.habit),
        tension: 0.32,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Daily Tracker Viz",
    },
  },
};

const chartData: Ref<iChartData> = ref(computeChartData());

axiosInstance
  .post(
    `${import.meta.env.DEV ? "" : "?query="}v1/databases/${
      import.meta.env.VITE_NOTION_DATABASE_WIP
    }/query`,
    {
      sorts: [
        {
          property: "Date",
          direction: "ascending",
        },
      ],
    }
  )
  .then((res) => {
    if (res && res.data) {
      const data_ = import.meta.env.DEV
        ? res.data.results
        : res.data.data.results;
      tracker.value = data_.slice(-30).map((dataByDay: any) => ({
        date: dataByDay.properties.Date.date.start,
        mood: dataByDay.properties.Mood.number ?? 0,
        habit: dataByDay.properties["Habit Progress"].formula.number * 10 ?? 0,
      }));
    }
  });

watch(
  () => tracker.value,
  () => {
    chartData.value = computeChartData();
  }
);
</script>

<style lang="scss"></style>
