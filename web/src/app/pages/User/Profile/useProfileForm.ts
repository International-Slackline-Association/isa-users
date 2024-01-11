import { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectUserInfo } from 'app/slices/user/selectors';
import { z } from 'zod';

export const useProfileForm = () => {
  const userInfo = useSelector(selectUserInfo);

  const [name, setName] = useState(userInfo!.name);
  const [surname, setSurname] = useState(userInfo!.surname);
  const [gender, setGender] = useState(userInfo!.gender);
  const [birthDate, setBirthDate] = useState(userInfo!.birthDate);
  const [phoneNumber, setPhoneNumber] = useState(userInfo!.phoneNumber);
  const [city, setCity] = useState(userInfo!.city);
  const [country, setCountry] = useState(userInfo!.country);
  const [emergencyContact, setEmergencyContact] = useState(userInfo!.emergencyContact);

  const values = () => {
    return {
      name,
      surname,
      gender,
      birthDate,
      phoneNumber,
      city,
      country,
      emergencyContact,
    };
  };

  const validate = () => {
    const phoneRegExp = /^$|^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    const profileSchema = z.object({
      name: z.string().trim().min(1),
      surname: z.string().trim().min(1),
      gender: z.enum(['m', 'f', 'o']),
      birthDate: z
        .date()
        .optional()
        .transform((v) => v?.toISOString().split('T')[0]),
      phoneNumber: z.optional(z.string().trim().regex(phoneRegExp)),
      city: z.string().trim().optional(),
      country: z.string().trim().optional(),
      emergencyContact: z.string().trim().regex(phoneRegExp).optional(),
    });
    const user = values();
    const birthDate = user.birthDate && new Date(user.birthDate);

    const data = profileSchema.safeParse({ ...user, birthDate });

    if (!data.success) {
      return {
        success: false,
        errors: data.error.issues.map((i) => ({
          field: i.path[0] as string,
          message: i.message,
        })),
      };
    }
    return { success: true, data: data.data };
  };

  return {
    name,
    setName,
    surname,
    setSurname,
    gender,
    setGender,
    birthDate,
    setBirthDate,
    phoneNumber,
    setPhoneNumber,
    city,
    setCity,
    country,
    setCountry,
    emergencyContact,
    setEmergencyContact,
    values,
    validate,
  };
};
