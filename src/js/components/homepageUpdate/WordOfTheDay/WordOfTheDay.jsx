/**
 * WordOfTheDay.jsx
 * Created by Brian Petway 08/22/22
 */

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexGridCol } from 'data-transparency-ui';
import { isCancel } from "axios";
import { fetchAllTerms } from "helpers/glossaryHelper";
import CardContainer from "../../sharedComponents/commonCards/CardContainer";
import CardBody from "../../sharedComponents/commonCards/CardBody";
import CardButton from "../../sharedComponents/commonCards/CardButton";

const WordOfTheDay = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [glossary, setGlossary] = useState('');

    const glossaryTerms = ["Account Balance (File A)",
        "Account Breakdown by Award (File C)",
        "Account Breakdown by Program Activity & Object Class (File B)",
        "Action Date",
        "Appropriation",
        "Assistance Listing (CFDA Program)",
        "Award",
        "Award Type",
        "Awards Data (File D)",
        "Budget Authority",
        "Budget Function",
        "Budgetary Resources",
        "Contract",
        "Deobligation",
        "Direct Loan",
        "Direct Payment",
        "Disaster Emergency Fund Code (DEFC)",
        "Face Value of Loan",
        "FAIN",
        "Federal Account",
        "Federal Action Obligation",
        "Financial Assistance",
        "Fiscal Year",
        "Funding Opportunity Number",
        "Grant",
        "Indefinite Delivery Vehicle (IDV)",
        "Insurance",
        "Loan",
        "Loan Subsidy Cost",
        "Multiple Recipients",
        "NAICS",
        "National Interest Action (NIA)",
        "Object Class",
        "Obligation",
        "Other Budgetary Resources",
        "Outlay",
        "Period of Performance Current End Date",
        "Period of Performance Potential End Date",
        "Period of Performance Start Date",
        "Potential Award Amount",
        "Primary Place of Performance",
        "Prime Award",
        "Prime Recipient",
        "Procurement Instrument Identifier (PIID)",
        "Product or Service Code (PSC)",
        "Program Activity",
        "Recipient",
        "Recipient Location",
        "Recipient/Business Types",
        "Redacted Due to PII",
        "Set Aside Type",
        "Spending",
        "Sub-Award",
        "Submission Period",
        "Sub-Recipient",
        "Transaction",
        "Treasury Account Symbol (TAS)",
        "Unique Entity Identifier",
        "Unlinked Award",
        "Unobligated Balance",
        "URI"];

    const selectWordOfTheDay = () => {
        const d = new Date();

        // convert to msec
        // subtract local time zone offset
        // get UTC time in msec
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        console.log(utc.toLocaleString());
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength - 5)}...`;
        }
        return text;
    };

    useEffect(() => {
        for (let i = 0; i < glossary.length; i++) {
            if (glossary[i].term === term) {
                setDefinition(glossary[i].plain);
            }
        }
        // setDefinition(glossary?.find((d) => d.term === term));
    }, [glossary]);

    useEffect(() => {
        fetchAllTerms().promise
            .then((res) => {
                setTerm(glossaryTerms[0]);
                setGlossary(res.data.results);
                setLoading(false);
                setError(false);
            })
            .catch((err) => {
                if (!isCancel(err)) {
                    console.log(err);
                    setLoading(false);
                    setError(true);
                }
            });
    }, []);

    return (
        <section className="word-of-the-day__section">
            <div className="word-of-the-day__heading">
                <div className="word-of-the-day__heading--background">
                    <FontAwesomeIcon className="word-of-the-day__heading--icon" icon="lightbulb" />
                </div>
                <span>Word of the Day</span>
            </div>
            <CardContainer variant="outline" fill="#1a4480">
                {/* eslint-disable-next-line no-nested-ternary */}
                {!loading && !error ?
                    <FlexGridCol>
                        <div className="word-of-the-day__headline">{truncateText(term, 30)}</div>
                        <div className="word-of-the-day__divider" />
                        <CardBody customClassName="word-of-the-day__body">
                            {truncateText(definition, 95)}
                            <CardButton variant="secondary" customClassName="word-of-the-day__button" text="Read More"/>
                        </CardBody>
                    </FlexGridCol>
                    :
                    <CardBody customClassName="word-of-the-day__body">
                        {loading ? <h3>Loading...</h3> : <h3>Error</h3>}
                    </CardBody>
                }
            </CardContainer>
        </section>
    );
};

export default WordOfTheDay;
