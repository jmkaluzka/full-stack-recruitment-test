import React from 'react';
import moment from 'moment';
import BpkButton from 'bpk-component-button';
import BpkCard from 'bpk-component-card';
import BpkSmArrowIcon from 'bpk-component-icon/sm/long-arrow-right';
import BpkText from 'bpk-component-text';

import STYLES from './Results.scss';

const getClassName = className => STYLES[className] || 'UNKNOWN';

const duration = minutes => {
  const h = Math.floor(minutes / 60);
  const m = minutes - h * 60;
  return `${h}h ${m}`;
};

const Leg = ({ leg }) => (
  <div key={leg.id} className={getClassName('Leg')}>
    <img
      src={`https://logos.skyscnr.com/images/airlines/favicon/${leg.airline_id}.png`}
      className={getClassName('Logo')}
    />
    <div className={getClassName('Stop')}>
      <BpkText>{moment(leg.departure_time).format("HH:mm")}</BpkText>
      <BpkText className={getClassName('Airport')}>{leg.arrival_airport}</BpkText>
    </div>

    <BpkSmArrowIcon className={getClassName('Arrow')} />
  
    <div className={getClassName('Stop')}>
      <BpkText>{moment(leg.arrival_time).format("HH:mm")}</BpkText>
      <BpkText className={getClassName('Airport')}>{leg.departure_airport}</BpkText>
    </div>


    <div className={getClassName('Duration')}>
      <BpkText>{duration(leg.duration_mins)}</BpkText>
      {leg.stops == 0 ?
        <BpkText className={getClassName('Direct')}>{'Direct'}</BpkText>
      : <BpkText className={getClassName('NonDirect')}>{`${leg.stops} stops`}</BpkText>
    }
    </div>
  </div>
);

const Itinerary = ({ itinerary }) => (
  <BpkCard key={Itinerary.id} className={getClassName('Itinerary')}>
    {itinerary.legs.map(leg => (
      <Leg key={leg.id} leg={leg} />
    ))}
    <div className={getClassName('Footer')}>
      <div className={getClassName('PriceAndAgent')}>
        <BpkText textStyle="xl">{itinerary.price}</BpkText>
        <BpkText className={getClassName('Agent')}>{itinerary.agent}</BpkText>
      </div>
      <BpkButton className={getClassName('Button')}>{'Select'}</BpkButton>
    </div>
  </BpkCard>
);

export default class Results extends React.Component {
  state = {
    flights: [],
  };

  componentDidMount() {
    fetch('flights.json')
      .then(response => response.json())
      .then(data => this.parseItineraries(data));
  }

  parseItineraries(data) {
    if (!data || data === undefined) return;
    const flights = [];
    data.itineraries.map(i => {
      flights.push({
        ...i,
        legs: data.legs.filter(l => i.legs.includes(l.id)),
      });
    });
    this.setState({ flights });
  }

  render() {
    return (
      <div className={getClassName('Results')}>
        {this.state.flights.map(f => (
          <Itinerary key={f.id} itinerary={f} />
        ))}
      </div>
    );
  }
}

