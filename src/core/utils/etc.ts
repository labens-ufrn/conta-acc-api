import { DateTime } from "luxon";

export function getSemesterFromEnrollment(enrollment: string) {
  const year = parseInt(enrollment.slice(0, 4));
  const month = parseInt(enrollment.slice(4, 6));

  const data = DateTime.fromObject({
    year,
    month,
    day: 1,
  });

  const diffMonths = DateTime.now().diff(data, "months").months;

  const countSemesters = Math.floor(diffMonths / 6);

  return countSemesters;
}

export function getCurrentSemester() {
  const now = DateTime.now();

  const semester = now.month >= 7 ? 2 : 1;

  const year = now.year;

  return { semester, year };
}

export function getCurrentSemesterString() {
  const now = DateTime.now();

  const semester = now.month >= 7 ? 2 : 1;

  const year = now.year;

  return `${year}/${semester}`;
}
