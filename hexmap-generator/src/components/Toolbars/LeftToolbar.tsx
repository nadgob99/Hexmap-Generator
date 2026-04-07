import React from 'react';
import { useHexMap, Tool } from '../../context/HexMapContext';
import { modeConfigs } from '../../constants/modeConfig';
import { placeholderIcons } from '../../constants/placeholderIcons';
import { PlaceholderType } from '../../types/placeholders';
import styles from './Toolbars.module.css';

const toolIcons: Record<string, string> = {
  select: '\u{1F446}',
  paint: '\u{1F3A8}',
  erase: '\u{1F9F9}',
  draw: '\u270F\uFE0F',
};

const LeftToolbar: React.FC = () => {
  const {
    mode, activeTool, setActiveTool,
    selectedPlaceholder, setSelectedPlaceholder,
  } = useHexMap();

  const config = modeConfigs[mode];
  const baseTools = config.tools.filter(t => t !== 'placeholder');

  const handlePlaceholderClick = (type: PlaceholderType) => {
    setActiveTool('placeholder');
    setSelectedPlaceholder(type);
  };

  return (
    <div className={styles.leftToolbar}>
      {baseTools.map(tool => (
        <button
          key={tool}
          className={`${styles.toolBtn} ${activeTool === tool && activeTool !== 'placeholder' ? styles.toolBtnActive : ''}`}
          title={tool.charAt(0).toUpperCase() + tool.slice(1)}
          onClick={() => { setActiveTool(tool as Tool); setSelectedPlaceholder(null); }}
        >
          {toolIcons[tool] || tool[0]}
        </button>
      ))}

      {config.placeholders && config.placeholders.length > 0 && (
        <>
          <div className={styles.toolDivider} />
          <div className={styles.placeholderSection}>
            {config.placeholders.map(p => (
              <button
                key={p}
                className={`${styles.placeholderBtn} ${
                  activeTool === 'placeholder' && selectedPlaceholder === p
                    ? styles.placeholderBtnActive
                    : ''
                }`}
                title={placeholderIcons[p].label}
                onClick={() => handlePlaceholderClick(p)}
              >
                {placeholderIcons[p].emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftToolbar;