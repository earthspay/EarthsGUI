import { Adapter, getAdapterByType, adapterList } from '@earths/signature-adapter';

let API: Adapter;

export function setSignatureApi(api: Adapter) {
    API = api;
}

export function dropSignatureApi() {
    API = null;
}

export function getSignatureApi(): Adapter {
    return API;
}

export function getDefaultSignatureApi(user): Adapter {

    const encryptionRounds = user.settings.get('encryptionRounds');
    const userData = { ...user, encryptionRounds };
    const Adapter = getAdapterByType(user.userType) ||
        getAdapterByType(adapterList[0].type);

    return new Adapter(userData);
}
