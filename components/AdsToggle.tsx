import React, { useEffect, useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface AdsToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export const AdsToggle: React.FC<AdsToggleProps> = ({ enabled, onChange }) => {
  const [checked, setChecked] = useState(enabled);

  useEffect(() => {
    setChecked(enabled);
  }, [enabled]);

  const toggle = (val: boolean) => {
    setChecked(val);
    onChange(val);
    try { localStorage.setItem('mm_showAds', val ? '1' : '0'); } catch {}
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={toggle} id="ads-toggle" />
      <Label htmlFor="ads-toggle" className="cursor-pointer text-sm">Ads</Label>
    </div>
  );
};

export const AdsContainer: React.FC = () => {
  // Placeholder ad blocks
  return (
    <div className="grid gap-4 md:grid-cols-3 my-8">
      {[1,2,3].map(i => (
        <div key={i} className="h-32 rounded-md border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
          Ad space #{i}
        </div>
      ))}
    </div>
  );
};