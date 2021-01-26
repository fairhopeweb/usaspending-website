import {
    mockContract,
    mockAwardAmounts,
    mockFileDownloadResponseIdv,
    mockFileDownloadResponseAssistance,
    mockFileDownloadResponseContract
} from "../../models/award/mockAwardApi";

// Fetch Individual Awards
export const fetchAwardV2 = () => (
    {
        promise: new Promise((resolve) => {
            process.nextTick(() => {
                resolve({
                    data: mockContract
                });
            });
        }),
        cancel: jest.fn()
    }
);

export const fetchAwardAmounts = () => (
    {
        promise: new Promise((resolve) => {
            process.nextTick(() => {
                resolve({
                    data: mockAwardAmounts
                });
            });
        }),
        cancel: jest.fn()
    }
);

export const fetchIdvDownloadFile = () => ({
    promise: new Promise((resolve) => {
        process.nextTick(() => {
            resolve({
                data: mockFileDownloadResponseIdv
            });
        });
    }),
    cancel: jest.fn()
});

export const fetchContractDownloadFile = () => ({
    promise: new Promise((resolve) => {
        process.nextTick(() => {
            resolve({
                data: mockFileDownloadResponseContract
            });
        });
    }),
    cancel: jest.fn()
});

export const fetchAssistanceDownloadFile = () => ({
    promise: new Promise((resolve) => {
        process.nextTick(() => {
            resolve({
                data: mockFileDownloadResponseAssistance
            });
        });
    }),
    cancel: jest.fn()
});

export const getChildAwardFileCDetails = (data) => data;

export const fetchDEFCodes = () => ({
    promise: new Promise((resolve) => {
        process.nextTick(() => {
            resolve({
                data: {
                    codes: [
                        { code: 'L', disaster: 'covid-19' },
                        { code: 'M', disaster: 'covid-19' },
                        { code: 'A', disaster: 'not_covid-19' }
                    ]
                }
            });
        });
    }),
    cancel: jest.fn()
});
