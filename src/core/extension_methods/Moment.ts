import * as moment from 'moment';

declare module "moment" {
    export interface Moment {
        lxFormat(): string;
        lxStoreFormat(): string;
        lxApiFormat(): string;
    }
}

(<any>moment).fn.lxFormat = function() {
    return this.format('D MMM yyy HH:mm');
};

(<any>moment).fn.lxStoreFormat = function() {
    return this.format('yyy-MM-D HH:mm:ss');
};

(<any>moment).fn.lxApiFormat = function() {
    return this.format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
};