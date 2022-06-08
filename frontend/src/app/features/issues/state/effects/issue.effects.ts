import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { IssueService } from '@features/issues/services/issue.service';
import {
  IssueApiActions,
  IssuePageActions,
} from '@features/issues/state/actions';
import { FeedbackService } from '@core/services/feedback.service';
import { FeedbackTypes } from '@core/enums/feedback-types.enum';

@Injectable()
export class IssueEffects {
  constructor(
    private actions$: Actions,
    private issueService: IssueService,
    private feedbackService: FeedbackService
  ) {}

  loadIssues$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IssuePageActions.loadIssues),
      mergeMap((action) => {
        return this.issueService.getIssuesByProjectId(action.projectId).pipe(
          map((issues) => IssueApiActions.loadIssuesSuccess({ issues })),
          catchError((error) =>
            of(IssueApiActions.loadIssuesFailure({ error: error.message }))
          )
        );
      })
    );
  });

  createIssue$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IssuePageActions.createIssue),
      mergeMap((action) => {
        return this.issueService.create(action.issue).pipe(
          map((issue) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              `Tarea  ${issue.projectKey}-${issue.key} creada correctamente.`
            );
            return IssueApiActions.createIssueSuccess({ issue });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'La tarea no pudo ser creada',
              error.message
            );
            return of(IssueApiActions.createIssueFailure({ error }));
          })
        );
      })
    );
  });

  updateIssue$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IssuePageActions.updateIssue),
      mergeMap((action) => {
        return this.issueService.update(action.issue.id, action.issue).pipe(
          map((issue) => IssueApiActions.updateIssueSuccess({ issue })),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'La tarea no pudo ser actualizada',
              error.message
            );
            return of(IssueApiActions.updateIssueFailure({ error }));
          })
        );
      })
    );
  });

  deleteIssue$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IssuePageActions.deleteIssue),
      mergeMap((action) => {
        return this.issueService.remove(action.issueId).pipe(
          map((issueId) => {
            this.feedbackService.createMessage(
              FeedbackTypes.success,
              `La tarea ha sido eliminada.`
            );
            return IssueApiActions.deleteIssueSuccess({ issueId });
          }),
          catchError((error) => {
            this.feedbackService.createNotification(
              FeedbackTypes.error,
              'La tarea no pudo eliminarse',
              error.message
            );
            return of(IssueApiActions.deleteIssueFailure({ error }));
          })
        );
      })
    );
  });
}
