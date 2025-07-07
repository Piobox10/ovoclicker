
import { Decimal } from 'decimal.js';

export const formatNumber = (num: Decimal | number | string): string => {
    if (!(num instanceof Decimal)) {
        num = new Decimal(num);
    }
    if (num.isZero()) return "0";

    const absNum = num.abs();
    const sign = num.isNegative() ? "-" : "";

    if (absNum.lessThan(0.01) && !absNum.isZero()) return num.toPrecision(2);
    if (absNum.lessThan(1000)) return num.toDecimalPlaces(2).toString().replace(/\.00$/, "");

    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];
    let tier = 0;
    let x = new Decimal(absNum);
    while (x.greaterThanOrEqualTo(1000) && tier < suffixes.length - 1) {
        x = x.dividedBy(1000);
        tier++;
    }

    let formatted = x.toDecimalPlaces(2).toString();
    if (formatted.endsWith('.00')) {
        formatted = x.toDecimalPlaces(0).toString();
    } else if (formatted.endsWith('0')) {
        formatted = x.toDecimalPlaces(1).toString();
    }

    return sign + formatted + suffixes[tier];
};

export const formatTime = (secondsDecimal: Decimal | number): string => {
    const totalSeconds = Math.floor(secondsDecimal instanceof Decimal ? secondsDecimal.toNumber() : secondsDecimal);
    if (totalSeconds < 0) return "00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
