import { computed, onBeforeUnmount, ref } from "vue";

interface CountdownOptions {
  intervalMs?: number;
  onFinish?: () => void;
}

const clampMs = (value?: number) => Math.max(0, Math.trunc(value ?? 0));

export const useCountdown = (
  initialMs: number,
  options: CountdownOptions = {},
) => {
  const remaining = ref(clampMs(initialMs));
  const isRunning = ref(false);

  const intervalDuration = clampMs(options.intervalMs) || 1000;
  const onFinish = options.onFinish;

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let anchorTimestamp = 0;
  let anchorRemaining = remaining.value;

  const stopInterval = () => {
    if (intervalId != null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const finish = () => {
    if (!isRunning.value) {
      stopInterval();
      return;
    }
    stopInterval();
    isRunning.value = false;
    remaining.value = 0;
    anchorRemaining = 0;
    anchorTimestamp = Date.now();
    if (onFinish) {
      onFinish();
    }
  };

  const tick = () => {
    if (!isRunning.value) return;
    const elapsed = Date.now() - anchorTimestamp;
    const next = Math.max(0, anchorRemaining - elapsed);
    if (next !== remaining.value) {
      remaining.value = next;
    }
    if (next <= 0) {
      finish();
    }
  };

  const startInterval = () => {
    if (intervalId != null || !isRunning.value) return;
    intervalId = setInterval(tick, intervalDuration);
  };

  const start = (ms?: number) => {
    const initial = clampMs(ms ?? initialMs);
    anchorRemaining = initial;
    anchorTimestamp = Date.now();
    remaining.value = initial;
    if (initial <= 0) {
      stopInterval();
      isRunning.value = false;
      if (initial === 0 && onFinish) {
        onFinish();
      }
      return;
    }
    isRunning.value = true;
    stopInterval();
    startInterval();
    tick();
  };

  const pause = () => {
    if (!isRunning.value) return;
    tick();
    anchorRemaining = remaining.value;
    isRunning.value = false;
    stopInterval();
  };

  const resume = () => {
    if (isRunning.value || remaining.value <= 0) return;
    anchorRemaining = remaining.value;
    anchorTimestamp = Date.now();
    isRunning.value = true;
    startInterval();
  };

  const reset = (ms?: number) => {
    const next = clampMs(ms ?? initialMs);
    remaining.value = next;
    anchorRemaining = next;
    isRunning.value = false;
    stopInterval();
  };

  const stop = () => {
    stopInterval();
    remaining.value = 0;
    anchorRemaining = 0;
    isRunning.value = false;
  };

  const display = computed(() => {
    const totalSeconds = Math.floor(remaining.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value: number) => value.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  onBeforeUnmount(() => {
    stopInterval();
  });

  return {
    display,
    remaining,
    isRunning,
    start,
    pause,
    resume,
    reset,
    stop,
  } as const;
};

export type UseCountdownReturn = ReturnType<typeof useCountdown>;
