import { FC, useEffect, useState, useCallback, ChangeEvent } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/Sheet';
import { VscArrowUp, VscArrowRight, VscArrowDown, VscArrowLeft, VscColorMode } from 'react-icons/vsc';
import { useMailEditor } from '@/hooks/use-mail-editor';

// Helper function to convert RGB to Hex
const rgbToHex = (rgb: string) => {
  if (rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') {
    return '#ffffff'; // Default to white for transparent backgrounds in color picker
  }
  const rgbMatch = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
  if (!rgbMatch) return '#ffffff'; // Default to white if no match

  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

interface MailElementEditorProps {
  isSelectionModeActive: boolean; 
  onClose: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const MailElementEditor: FC<MailElementEditorProps> = ({ isSelectionModeActive, onClose, iframeRef }) => {
  const { setMailContent } = useMailEditor();
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [stylesToEdit, setStylesToEdit] = useState<{
    color: string;
    backgroundColor: string;
    padding: { top: string; right: string; bottom: string; left: string };
    margin: { top: string; right: string; bottom: string; left: string };
    textAlign: string;
    [key: string]: any; // Allow other string properties
  }>({
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: { top: '', right: '', bottom: '', left: '' },
    margin: { top: '', right: '', bottom: '', left: '' },
    textAlign: 'left', // Default value
  });
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  // Helper to parse shorthand CSS values (e.g., "10px 20px" or "5px")
  const parseShorthand = useCallback((shorthand: string) => {
    const parts = shorthand.split(/\s+/).filter(Boolean);
    let top = '', right = '', bottom = '', left = '';

    if (parts.length === 1) {
      top = right = bottom = left = parts[0];
    } else if (parts.length === 2) {
      top = bottom = parts[0];
      right = left = parts[1];
    } else if (parts.length === 3) {
      top = parts[0];
      right = left = parts[1];
      bottom = parts[2];
    } else if (parts.length === 4) {
      top = parts[0];
      right = parts[1];
      bottom = parts[2];
      left = parts[3];
    }
    return { top, right, bottom, left };
  }, []);

  // Function to reset all states and remove highlights
  const resetEditorState = useCallback(() => {
    if (selectedElement) {
      selectedElement.style.outline = '';
    }
    if (hoveredElement) {
      hoveredElement.style.outline = '';
    }
    setSelectedElement(null);
    setStylesToEdit({
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: { top: '', right: '', bottom: '', left: '' },
      margin: { top: '', right: '', bottom: '', left: '' },
      textAlign: 'left',
    });
    setHoveredElement(null);
  }, [selectedElement, hoveredElement]);

  const applyStyle = useCallback((property: string, value: string | { top: string; right: string; bottom: string; left: string }) => {
    if (selectedElement) {
      if (typeof value === 'string') {
        (selectedElement.style as any)[property] = value;
      } else {
        // For padding/margin, reassemble the shorthand string
        const { top, right, bottom, left } = value;
        selectedElement.style[property as 'padding' | 'margin'] = `${top} ${right} ${bottom} ${left}`;
      }
    }
  }, [selectedElement]);

  const handleStyleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStylesToEdit(prev => ({ ...prev, [name]: value }));
    applyStyle(name, value);
  }, [applyStyle]);

  const handlePaddingMarginChange = useCallback((e: ChangeEvent<HTMLInputElement>, side: 'top' | 'right' | 'bottom' | 'left', property: 'padding' | 'margin') => {
    const { value } = e.target;
    setStylesToEdit(prev => {
      const newProperty = { ...prev[property], [side]: value };
      applyStyle(property, newProperty);
      return { ...prev, [property]: newProperty };
    });
  }, [applyStyle]);

  const handleElementClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;

    // Remove outline from previously selected element
    if (selectedElement && selectedElement !== target) {
      selectedElement.style.outline = '';
    }
    // Remove hover outline if present
    if (hoveredElement && hoveredElement !== target) {
      hoveredElement.style.outline = '';
    }

    setSelectedElement(target);
    const computedStyles = window.getComputedStyle(target);
    setStylesToEdit({
      color: rgbToHex(computedStyles.color), // Convert to hex
      backgroundColor: rgbToHex(computedStyles.backgroundColor), // Convert to hex
      padding: parseShorthand(computedStyles.padding),
      margin: parseShorthand(computedStyles.margin),
      textAlign: computedStyles.textAlign,
    });
    target.style.outline = '';
  }, [selectedElement, hoveredElement, parseShorthand]);

  // Effect to reset state when selection mode is deactivated externally
  useEffect(() => {
    if (!isSelectionModeActive) {
      resetEditorState();
    }
  }, [isSelectionModeActive, resetEditorState]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target && target !== hoveredElement && target !== selectedElement) {
      if (hoveredElement) {
        hoveredElement.style.outline = ''; // Remove previous hover highlight
      }
      target.style.outline = '2px solid blue'; // Add new hover highlight
      setHoveredElement(target);
    }
  }, [hoveredElement, selectedElement]);

  const handleMouseOut = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target === hoveredElement && target !== selectedElement) {
      target.style.outline = ''; // Remove hover highlight
      setHoveredElement(null);
    }
  }, [hoveredElement, selectedElement]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    if (isSelectionModeActive) { // Use isSelectionModeActive
      iframeDoc.addEventListener('click', handleElementClick, true);
      iframeDoc.addEventListener('mousemove', handleMouseMove, true);
      iframeDoc.addEventListener('mouseout', handleMouseOut, true);
      iframeDoc.body.style.cursor = 'pointer'; // Change cursor to pointer
    } else {
      iframeDoc.removeEventListener('click', handleElementClick, true);
      iframeDoc.removeEventListener('mousemove', handleMouseMove, true);
      iframeDoc.removeEventListener('mouseout', handleMouseOut, true);
      iframeDoc.body.style.cursor = 'default'; // Reset cursor
      // State reset is handled by the new useEffect for isSelectionModeActive
    }

    return () => {
      if (iframeDoc) {
        iframeDoc.removeEventListener('click', handleElementClick, true);
        iframeDoc.removeEventListener('mousemove', handleMouseMove, true);
        iframeDoc.removeEventListener('mouseout', handleMouseOut, true);
        iframeDoc.body.style.cursor = 'default';
        // State reset is handled by the new useEffect for isSelectionModeActive
      }
    };
  }, [isSelectionModeActive, iframeRef, handleElementClick, handleMouseMove, handleMouseOut]);

  const handleSheetClose = useCallback(() => {
    resetEditorState();
    // Update the mail content in the global state
    if (iframeRef.current?.contentDocument) {
      setMailContent(iframeRef.current.contentDocument.documentElement.outerHTML);
    }
    onClose(); // Signal MailPreview to deactivate selection mode
  }, [resetEditorState, onClose, setMailContent, iframeRef]);

  return (
    <Sheet open={selectedElement !== null} onOpenChange={handleSheetClose}> {/* Sheet opens only when an element is selected */}
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Element Styles</SheetTitle>
          <SheetDescription>
            {selectedElement ? `Editing: <${selectedElement.tagName.toLowerCase()}>` : 'Select an element in the preview to modify its styles.'}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <VscColorMode size={20} className="text-base-content/70" />
                <label className="block text-sm font-medium text-base-content flex-grow">Color</label>
                <input
                  type="color"
                  name="color"
                  value={stylesToEdit.color}
                  onChange={handleStyleChange}
                  className="input input-bordered w-12 h-8 p-0"
                  title={stylesToEdit.color}
                />
              </div>
              <div className="flex items-center gap-2">
                <VscColorMode size={20} className="text-base-content/70" />
                <label className="block text-sm font-medium text-base-content flex-grow">Background Color</label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={stylesToEdit.backgroundColor}
                  onChange={handleStyleChange}
                  className="input input-bordered w-12 h-8 p-0"
                  title={stylesToEdit.backgroundColor}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">Text Align</label>
                <select
                  name="textAlign"
                  value={stylesToEdit.textAlign}
                  onChange={handleStyleChange}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">Padding</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="tooltip tooltip-top" data-tip="Padding Top">
                    <div className="flex items-center gap-1">
                      <VscArrowUp size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="paddingTop"
                        value={stylesToEdit.padding.top}
                        onChange={(e) => handlePaddingMarginChange(e, 'top', 'padding')}
                        placeholder="Top"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Padding Right">
                    <div className="flex items-center gap-1">
                      <VscArrowRight size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="paddingRight"
                        value={stylesToEdit.padding.right}
                        onChange={(e) => handlePaddingMarginChange(e, 'right', 'padding')}
                        placeholder="Right"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Padding Bottom">
                    <div className="flex items-center gap-1">
                      <VscArrowDown size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="paddingBottom"
                        value={stylesToEdit.padding.bottom}
                        onChange={(e) => handlePaddingMarginChange(e, 'bottom', 'padding')}
                        placeholder="Bottom"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Padding Left">
                    <div className="flex items-center gap-1">
                      <VscArrowLeft size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="paddingLeft"
                        value={stylesToEdit.padding.left}
                        onChange={(e) => handlePaddingMarginChange(e, 'left', 'padding')}
                        placeholder="Left"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">Margin</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="tooltip tooltip-top" data-tip="Margin Top">
                    <div className="flex items-center gap-1">
                      <VscArrowUp size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="marginTop"
                        value={stylesToEdit.margin.top}
                        onChange={(e) => handlePaddingMarginChange(e, 'top', 'margin')}
                        placeholder="Top"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Margin Right">
                    <div className="flex items-center gap-1">
                      <VscArrowRight size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="marginRight"
                        value={stylesToEdit.margin.right}
                        onChange={(e) => handlePaddingMarginChange(e, 'right', 'margin')}
                        placeholder="Right"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Margin Bottom">
                    <div className="flex items-center gap-1">
                      <VscArrowDown size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="marginBottom"
                        value={stylesToEdit.margin.bottom}
                        onChange={(e) => handlePaddingMarginChange(e, 'bottom', 'margin')}
                        placeholder="Bottom"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="tooltip tooltip-top" data-tip="Margin Left">
                    <div className="flex items-center gap-1">
                      <VscArrowLeft size={16} className="text-base-content/70" />
                      <input
                        type="text"
                        name="marginLeft"
                        value={stylesToEdit.margin.left}
                        onChange={(e) => handlePaddingMarginChange(e, 'left', 'margin')}
                        placeholder="Left"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Add more style inputs here */}
            </div>
          ) : (
            <p>No element selected. Click on an element in the preview.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MailElementEditor;
