/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-spy
 */
/*tslint:disable:no-debugger*/

import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { Match, matches } from "../match";
import { BasePlugin, Event } from "./plugin";
import { SnapshotObservable, SnapshotPlugin } from "./snapshot-plugin";

export class DebugPlugin extends BasePlugin {

    private events_: Event[];
    private matcher_: (observable: Observable<any>, event: Event) => boolean;
    private snapshotPlugin_: SnapshotPlugin | null;

    constructor(match: Match, events: Event[], snapshotPlugin: SnapshotPlugin | null) {

        super();

        this.events_ = events;
        this.matcher_ = (observable: Observable<any>, event: Event) => matches(observable, match) && (this.events_.indexOf(event) !== -1);
        this.snapshotPlugin_ = snapshotPlugin;
    }

    beforeComplete(observable: Observable<any>, subscriber: Subscriber<any>): void {

        const { matcher_ } = this;

        if (matcher_(observable, "complete")) {
            const snapshot = this.getSnapshot_(observable);
            debugger;
        }
    }

    beforeError(observable: Observable<any>, subscriber: Subscriber<any>, error: any): void {

        const { matcher_ } = this;

        if (matcher_(observable, "error")) {
            const snapshot = this.getSnapshot_(observable);
            debugger;
        }
    }

    beforeNext(observable: Observable<any>, subscriber: Subscriber<any>, value: any): void {

        const { matcher_ } = this;

        if (matcher_(observable, "next")) {
            const snapshot = this.getSnapshot_(observable);
            debugger;
        }
    }

    beforeSubscribe(observable: Observable<any>, subscriber: Subscriber<any>): void {

        const { matcher_ } = this;

        if (matcher_(observable, "subscribe")) {
            const snapshot = this.getSnapshot_(observable);
            debugger;
        }
    }

    beforeUnsubscribe(observable: Observable<any>, subscriber: Subscriber<any>): void {

        const { matcher_ } = this;

        if (matcher_(observable, "unsubscribe")) {
            const snapshot = this.getSnapshot_(observable);
            debugger;
        }
    }

    private getSnapshot_(observable: Observable<any>): SnapshotObservable | null {

        const { snapshotPlugin_ } = this;
        if (!snapshotPlugin_) {
            return null;
        }

        const snapshot = snapshotPlugin_.snapshot();
        return snapshot.observables.find((o) => o.observable === observable) || null;
    }
}
