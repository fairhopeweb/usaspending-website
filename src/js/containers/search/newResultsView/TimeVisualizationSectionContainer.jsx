/**
 * TimeVisualizationSectionContainer.jsx
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isCancel } from 'axios';

import * as searchFilterActions from 'redux/actions/search/searchFilterActions';
import { setAppliedFilterCompletion } from 'redux/actions/search/appliedFilterActions';

import * as SearchHelper from 'helpers/searchHelper';
import * as MonthHelper from 'helpers/monthHelper';

import SearchAwardsOperation from 'models/v1/search/SearchAwardsOperation';
import TimeVisualizationChart from "../../../components/search/visualizations/time/TimeVisualizationChart";
import SearchSectionWrapper from "../../../components/search/newResultsView/SearchSectionWrapper";

const combinedActions = Object.assign({}, searchFilterActions, {
    setAppliedFilterCompletion
});

const propTypes = {
    reduxFilters: PropTypes.object,
    setAppliedFilterCompletion: PropTypes.func,
    noApplied: PropTypes.bool,
    subaward: PropTypes.bool,
    visualizationPeriod: PropTypes.string
};

const TimeVisualizationSectionContainer = (props) => {
    const [visualizationPeriod, setVisualizationPeriod] = useState(props.visualizationPeriod);
    const [parsedData, setParsedData] = useState({
        loading: true,
        error: false,
        groups: [],
        xSeries: [],
        ySeries: [],
        rawLabels: []
    });
    const [tableRows, setTableRows] = useState([]);

    let apiRequest = null;
    const fy = [
        {
            title: "fy",
            displayName: ["Fiscal Year"],
            right: false
        },
        {
            title: "obligations",
            displayName: ["Obligations"],
            right: true
        }
    ];

    const columns = {
        month: [
            {
                title: 'months',
                displayName: ["Month"],
                right: false
            },
            ...fy
        ],
        quarter: [
            {
                title: 'quarters',
                displayName: ["Quarter"],
                right: false
            },
            ...fy
        ],
        fiscal_year: fy
    };

    const generateTimeLabel = (group, timePeriod) => {
        if (group === 'fiscal_year') {
            return timePeriod.fiscal_year;
        }
        else if (group === 'quarter') {
            return `Q${timePeriod.quarter} ${timePeriod.fiscal_year}`;
        }

        const month = MonthHelper.convertNumToShortMonth(timePeriod.month);
        const year = MonthHelper.convertMonthToFY(timePeriod.month, timePeriod.fiscal_year);

        return `${month} ${year}`;
    };

    const generateTimeRaw = (group, timePeriod) => {
        if (group === 'fiscal_year') {
            return {
                period: null,
                year: timePeriod.fiscal_year
            };
        }
        else if (group === 'quarter') {
            return {
                period: `Q${timePeriod.quarter}`,
                year: `${timePeriod.fiscal_year}`
            };
        }

        const month = MonthHelper.convertNumToShortMonth(timePeriod.month);
        const year = MonthHelper.convertMonthToFY(timePeriod.month, timePeriod.fiscal_year);

        return {
            period: `${month}`,
            year: `${year}`
        };
    };
    const parseData = (data, group) => {
        const tempGroups = [];
        const tempXSeries = [];
        const tempYSeries = [];
        const tempRawLabels = [];

        // iterate through each response object and break it up into groups, x series, and y series
        data.results.forEach((item) => {
            tempGroups.push(generateTimeLabel(group, item.time_period));
            tempRawLabels.push(generateTimeRaw(group, item.time_period));
            tempXSeries.push([generateTimeLabel(group, item.time_period)]);
            tempYSeries.push([parseFloat(item.aggregated_amount)]);
        });

        setParsedData({
            groups: tempGroups,
            xSeries: tempXSeries,
            ySeries: tempYSeries,
            rawLabels: tempRawLabels,
            loading: false,
            error: false
        });
    };

    const fetchAwards = (auditTrail = null) => {
        const operation = new SearchAwardsOperation();
        operation.fromState(props.reduxFilters);

        // if subawards is true, newAwardsOnly cannot be true, so we remove
        // dateType for this request
        if (props.subaward && operation.dateType) {
            delete operation.dateType;
        }

        const searchParams = operation.toParams();

        // Generate the API parameters
        const apiParams = {
            group: visualizationPeriod,
            filters: searchParams,
            subawards: props.subaward
        };

        if (auditTrail) {
            apiParams.auditTrail = auditTrail;
        }

        apiRequest = SearchHelper.performSpendingOverTimeSearch(apiParams);

        apiRequest.promise
            .then((res) => {
                parseData(res.data, visualizationPeriod);
                apiRequest = null;
            })
            .catch((err) => {
                if (isCancel(err)) {
                    return;
                }

                props.setAppliedFilterCompletion(true);
                apiRequest = null;
                console.log(err);
                setParsedData({ ...parseData, loading: false, error: true });
            });
    };

    const generateTableRows = () => {
        const rows = [];
        for (let i = 0; i < parsedData.rawLabels?.length; i++) {
            const row = [];
            if (parsedData.rawLabels[i].period) {
                row.push(parsedData.rawLabels[i].period);
            }
            row.push(parsedData.rawLabels[i].year);
            row.push(parsedData.ySeries[i][0]);
            rows.push(row);
        }
        setTableRows(rows);
    };

    const fetchData = () => {
        props.setAppliedFilterCompletion(false);
        setParsedData({ ...parseData, loading: true, error: false });
        // Cancel API request if it exists
        if (apiRequest) {
            apiRequest.cancel();
        }

        // Fetch data from the Awards v2 endpoint
        fetchAwards('Spending Over Time Visualization');
    };

    useEffect(() => {
        if (!props.noApplied) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reduxFilters, props.subaward, visualizationPeriod]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizationPeriod]);

    useEffect(() => {
        if (parsedData.loading !== true && parsedData.error !== true) {
            props.setAppliedFilterCompletion(true);
        }

        generateTableRows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parsedData]);


    useEffect(() => {
        if (props.visualizationPeriod !== visualizationPeriod) {
            setVisualizationPeriod(props.visualizationPeriod);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.visualizationPeriod]);

    return (
        <SearchSectionWrapper
            {...props.wrapperProps}
            data={parsedData}
            columns={columns[visualizationPeriod]}
            rows={tableRows}
            isLoading={parsedData?.loading}
            isError={parsedData?.error}
            hasNoData={parsedData?.ySeries?.flat()?.reduce((partialSum, a) => partialSum + a, 0) === 0}
            manualSort>
            <TimeVisualizationChart
                {...parsedData}
                visualizationPeriod={visualizationPeriod}
                subaward={props.subaward} />
        </SearchSectionWrapper>
    );
};

TimeVisualizationSectionContainer.propTypes = propTypes;

export default connect(
    (state) => ({
        reduxFilters: state.appliedFilters.filters,
        noApplied: state.appliedFilters._empty,
        subaward: state.searchView.subaward
    }),
    (dispatch) => bindActionCreators(combinedActions, dispatch)
)(TimeVisualizationSectionContainer);
