import PhoneInput from './PhoneInput';
import OptStatusRadio from './OptStatusRadio';
import NameInput from './NameInput';

export default function SingleContactForm(props) {
  const { name, setName } = props; 

  return (
    <>
      <PhoneInput {...props} />
      <OptStatusRadio {...props} />
      <NameInput name={name} setName={setName} />
    </>
  );
}