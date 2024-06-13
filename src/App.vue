<template>
  <main>
    <Line id="mood-tracker-chart" :options="chartOptions" :data="chartData" />
    <span class="refresh-button" @click="refreshData">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-refresh-ccw"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    </span>
  </main>
</template>

<script setup lang="ts">
import "the-new-css-reset/css/reset.css";

import axiosInstance from "./helpers/axiosInstance";

import { Ref, onMounted, ref, watch } from "vue";

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

    ],
  };
};

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Daily Tracker Viz",
    },
  },
  animations: {
    tension: {
      duration: 1000,
      easing: "linear",
      from: 1,
      to: 0.32,
      loop: true,
    },
  },
  scales: {
    y: {
      // defining min and max so hiding the dataset does not change scale range
      min: 0,
      max: 10,
    },
  },
};

const chartData: Ref<iChartData> = ref(computeChartData());

const refreshData = () => {
  tracker.value = [];

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
        const dataToProcess =
          import.meta.env.VITE_LIMIT_30 === "true" ? data_.slice(-30) : data_;
        tracker.value = dataToProcess.map((dataByDay: any) => ({
          date: dataByDay.properties.Date.date.start,
          mood: dataByDay.properties.Mood.number ?? 0,
        }));
      }
    });
};

onMounted(() => {
  refreshData();
});

watch(
  () => tracker.value,
  () => {
    chartData.value = computeChartData();
  }
);
</script>

<style lang="scss">
.refresh-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #edf6f9;
  position: fixed;
  top: 16px;
  right: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: transform 0.64s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    * {
      stroke: #006d77;
    }
  }
}
</style>
