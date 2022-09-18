import type { CeramicApi } from '@ceramicnetwork/common';
import { IDX } from '@ceramicstudio/idx';
declare global {
    interface Window {
        idx?: IDX;
    }
}
export declare function createIDX(ceramic: CeramicApi): IDX;
//# sourceMappingURL=idx.d.ts.map