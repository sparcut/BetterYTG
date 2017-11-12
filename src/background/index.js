import InitiateOptions from './InitiateOptions';
import LiveChecker from './LiveChecker';

const main = () => {
  LiveChecker.init();
}

InitiateOptions().then(main);