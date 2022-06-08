import { Pipe, PipeTransform } from '@angular/core';

import { DateUtil } from '@core/utils/date';

@Pipe({
  name: 'issueTimeElapsed'
})
export class IssueTimeElapsedPipe implements PipeTransform {

  transform(date: string, _refreshCount?: number): string {
    const issueUpdatedAt = new Date(date);

    const days = DateUtil.getDays(issueUpdatedAt);
    if (days > 0) {
      return days === 1 ? `${days} dias` : `${days} dias`
    }

    const hours = DateUtil.getHours(issueUpdatedAt);
    if (hours > 0) {
      return hours === 1 ? `${hours} horas` : `${hours} horas`
    }

    const minutes = DateUtil.getMinutes(issueUpdatedAt);
    if (minutes > 0) {
      return minutes === 1 ? `${minutes} minutos` : `${minutes} minutos`
    }

    const seconds = DateUtil.getSeconds(issueUpdatedAt);
    return seconds === 1 ? `${seconds} segundos` : `${seconds} segundos`
  }

}
