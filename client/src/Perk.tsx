import React from 'react';

interface PerkProps {
  name: string;
  icon: JSX.Element;
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
}

const Perk: React.FC<PerkProps> = ({ name, icon, label, selected, onChange }) => {
  const handleCbClick = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter(selectedName => selectedName !== name)]);
    }
  };

  return (
    <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center">
      <input type="checkbox" checked={selected.includes(name)} name={name} onChange={handleCbClick} />
      {icon}
      <span>{label}</span>
    </label>
  );
};

export default Perk;
