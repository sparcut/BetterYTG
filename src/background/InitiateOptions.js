import Options from '../helpers/Options';
import CONFIG from '../config';

/**
 * InitiateOptions - Merge defaults with already set options
 */
const InitiateOptions = () => {
  return new Promise((res, rej) => {
    Options.on('ready', () => {
      const newOpts = Object.assign(CONFIG.defaultOptions, Options.get());
      res(Options.set(newOpts));
    });
  });
}

export default InitiateOptions;