import { getPlatform } from '../utils/platform';

let notesContainer: HTMLDivElement | null = null;

const injectNotesPanel = () => {
  if (!notesContainer) {
    notesContainer = document.createElement('div');
    notesContainer.id = 'extension-notes-panel';
    document.body.appendChild(notesContainer);

    const platform = getPlatform(window.location.hostname);
    
    // Mount React component
    import('../components/ToggleMenu').then(({ ToggleMenu }) => {
      const root = createRoot(notesContainer!);
      root.render(
        <ToggleMenuProvider>
          <ToggleMenu platform={platform} />
        </ToggleMenuProvider>
      );
    });
  }
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_NOTES_PANEL') {
    injectNotesPanel();
  }
});