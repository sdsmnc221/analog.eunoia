<template>
  <Suspense>
    <main>
      <Line id="mood-tracker-chart" :options="chartOptions" :data="chartData" />
    </main>
  </Suspense>
</template>

<script setup lang="ts">
import "the-new-css-reset/css/reset.css";

import axiosInstance from "./helpers/axiosInstance";

import { Suspense, Ref, ref, watch } from "vue";

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

interface MoodTracker {
  date: string;
  value: number;
}

interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor?: string }[];
}

const moods: Ref<MoodTracker[]> = ref([]);

const computeChartData = (): ChartData => {
  return {
    labels: moods.value.map((mood) => mood.date),
    datasets: [
      {
        label: "Mood",
        backgroundColor: "#57cc99",
        data: moods.value.map((mood) => mood.value),
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
      text: "Mood Tracker Viz",
    },
  },
};

const chartData: Ref<ChartData> = ref(computeChartData());

const res: any = await axiosInstance.post(
  `?query=v1/databases/${import.meta.env.VITE_NOTION_DATABASE_WIP}/query`,
  {
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
  }
);

console.log(res);

if (res && res.data && res.data.data && res.data.data.results) {
  moods.value = res.data.data.results.map((mood: any) => ({
    date: mood.properties.Date.date.start,
    value: mood.properties.Mood.number ?? 0,
  }));
}

watch(moods, () => {
  chartData.value = computeChartData();
  console.log(chartData.value);
});
</script>

<style lang="scss"></style>
