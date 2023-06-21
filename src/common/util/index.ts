import moment from 'moment/moment';
import { BN } from '@project-serum/anchor';
import { toBN } from '@gemworks/gem-farm-ts';

export function removeManyFromList(toRemove: any[], fromList: any[]) {
  toRemove.forEach((i) => {
    const index = fromList.indexOf(i);
    if (index > -1) {
      fromList.splice(index, 1);
    }
  });
}

//returns stuff in list1 but not in list2
export function getListDiff(list1: any[], list2: any[]): any[] {
  return list1.filter((i) => !list2.includes(i));
}

export function getListDiffBasedOnMints(list1: any[], list2: any[]): any[] {
  const list1Mints = list1.map((i) => i.mint.toBase58());
  const list2Mints = list2.map((i) => i.mint.toBase58());

  const diff = getListDiff(list1Mints, list2Mints);

  return list1.filter((i) => diff.includes(i.mint.toBase58()));
}

export function parseDate(unixTsSec: number | string | BN) {
  const unixBN = toBN(unixTsSec);
  if (unixBN.eq(new BN(0))) {
    return '--';
  }

  const dateObj = new Date(unixBN.mul(new BN(1000)).toNumber());
  return dateObj;
}
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


function getFormattedDate(date: any, prefomattedDate = "", hideYear = false) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${ minutes }`;
  }

  if (prefomattedDate != "") {
    // Today at 10:20
    // Yesterday at 10:20
    return `${ prefomattedDate } at ${ hours > 12 ? hours - 12 : hours }:${ minutes } ${hours > 12 ? 'PM' : 'AM'}`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${ day } ${ month } at ${ hours > 12 ? hours - 12 : hours }:${ minutes } ${hours > 12 ? 'PM' : 'AM'}`;
  }

  // 10. January 2017. at 10:20
  return `${ day } ${ month } ${ year }. at ${ hours > 12 ? hours - 12 : hours }:${ minutes } ${hours > 12 ? 'PM' : 'AM'}`;
}


// --- Main function
export function timeAgo(dateParam: any) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today.getTime() - DAY_IN_MS);
  const seconds = Math.round((today.getTime() - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();


  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return `${ seconds } seconds ago`;
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return `${ minutes } minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, 'Today'); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, "", true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}