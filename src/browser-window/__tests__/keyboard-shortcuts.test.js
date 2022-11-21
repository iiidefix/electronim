/*
   Copyright 2022 Marc Nuri San Felix

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
describe('Main :: Global Keyboard Shortcuts module test suite', () => {
  let electron;
  let browserWindow;
  let inputEvent;
  beforeEach(() => {
    jest.resetModules();
    jest.mock('electron', () => require('../../__tests__').mockElectronInstance());
    electron = require('electron');
    browserWindow = require('../../__tests__').mockBrowserWindowInstance();
    require('../').registerAppShortcuts({}, browserWindow.webContents);
    inputEvent = {
      preventDefault: jest.fn()
    };
  });
  test.each([
    [{key: 'Escape', appEvent: 'appMenuClose'}], [{key: 'Escape', appEvent: 'closeDialog'}],
    [{key: 'F11', appEvent: 'fullscreenToggle'}]
  ])('Key "$key" triggers "$appEvent" app event', ({key, appEvent}) => {
    browserWindow.listeners['before-input-event'](inputEvent, {key});
    expect(electron.ipcMain.emit).toHaveBeenCalledWith(appEvent);
  });
  describe('preventDefault', () => {
    test('calls preventDefault if key is registered', () => {
      browserWindow.listeners['before-input-event'](inputEvent, {key: 'Escape'});
      expect(inputEvent.preventDefault).toHaveBeenCalled();
    });
    test('doesn\'t call preventDefault if key is not registered', () => {
      browserWindow.listeners['before-input-event'](inputEvent, {});
      expect(inputEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});