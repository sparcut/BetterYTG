import './sass/options.sass'

const saveOptions = (options) => {
  return new Promise((res, rej) => {
    chrome.storage.sync.get('options', (items = {}) => {
      const oldOptions = items.options || {};
      const newOptions = Object.assign(oldOptions, options);
      chrome.storage.sync.set({ options: newOptions }, () => {
        res();
      });
    });
  });
}

const setSavingStatus = (status) => {
  const SaveStatusEle = document.getElementById('save-status');

  switch(status) {
    case 'saving':
      SaveStatusEle.innerHTML = 'Saving ...';
    break;
    case 'saved':
      SaveStatusEle.innerHTML = 'Saved';
    break;
    default:
      SaveStatusEle.innerHTML = '&nbsp;';
  }
}

const OptionInputs = document.querySelectorAll('.option-input');

chrome.storage.sync.get('options', (items = {}) => {
  const options = items.options || {};
  OptionInputs.forEach((input) => {
    const isCheckbox = input.type === 'checkbox' ? true : false;

    if(options.hasOwnProperty(input.id)) {
      if(isCheckbox) {
        input.checked = options[input.id];
      } else {
        input.value = options[input.id];
      }
    }

    input.removeAttribute('disabled');

    const inputType = isCheckbox ? 'change' : 'input';
    const onInputChange = () => {
      if(isCheckbox) {
        return () => {
          setSavingStatus('saving');
          saveOptions({ [input.id]: input.checked })
            .then(() => {
              setSavingStatus('saved');
            });
        }
      } else {
        return () => {
          setSavingStatus('saving');
          saveOptions({ [input.id]: input.value })
            .then(() => {
              setSavingStatus('saved');
            });
        }
      }
    }
    input.addEventListener(inputType, onInputChange());
  });
});
