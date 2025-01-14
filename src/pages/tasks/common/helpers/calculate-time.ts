/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime'

export type TimeLogType = [number, number, string, boolean];
export type TimeLogsType = TimeLogType[];

export function parseTimeLog(log: string) {
  if (log === '' || log === '[]') {
    return [];
  }

  const defaultRow: TimeLogsType = [[0, 0, '', true]];
  const parsed: TimeLogsType = JSON.parse(log);

  if (!parsed.length) {
    return defaultRow;
  }

  return parsed;
}

interface CalculateTimeOptions {
  inSeconds?: boolean;
  calculateLastTimeLog?: boolean;
}

export function calculateTime(log: string, options?: CalculateTimeOptions) {
  const times = parseTimeLog(log);
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  let seconds = 0;

  if (options?.calculateLastTimeLog) {
    const lastLogIndex = times.length - 1;

    const start = times[lastLogIndex][0];
    const startTime = start ? dayjs.unix(start) : dayjs();

    seconds += dayjs().diff(startTime, 'seconds');
  } else {
    times.map(([start, stop]) => {
      const startTime = start ? dayjs.unix(start) : dayjs();
      const stopTime = stop ? dayjs.unix(stop) : dayjs();

      seconds += stopTime.diff(startTime, 'seconds');
    });
  }

  if (options?.inSeconds) {
    return seconds.toString();
  }
  
  return seconds > 86400 ? dayjs.duration(seconds, 'seconds').humanize() : dayjs.duration(seconds, 'seconds').format('HH:mm:ss');

}

export function calculateDifferenceBetweenLogs(log: string, logIndex: number) {
  const times = parseTimeLog(log);
  const logTimes = times[logIndex];

  const start = logTimes ? dayjs.unix(logTimes[0]) : dayjs();
  const end = logTimes ? dayjs.unix(logTimes[1]) : dayjs();

  const seconds = end.diff(start, 'seconds');

  return new Date(seconds * 1000).toISOString().slice(11, 19);
}
