import { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectOrganizationInfo } from 'app/slices/organization/selectors';
import { z } from 'zod';

export const useProfileForm = () => {
  const organizationInfo = useSelector(selectOrganizationInfo);

  const [name, setName] = useState(organizationInfo!.name);
  const [contactPhone, setContactPhone] = useState(organizationInfo!.contactPhone);
  const [city, setCity] = useState(organizationInfo!.city);
  const [country, setCountry] = useState(organizationInfo!.country);

  const values = () => {
    return {
      name,
      city,
      country,
      contactPhone,
    };
  };

  const validate = () => {
    const phoneRegExp = /^$|^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    const profileSchema = z.object({
      name: z.string().trim().min(1),
      contactPhone: z.optional(z.string().trim().regex(phoneRegExp)),
      city: z.string().trim().optional(),
      country: z.string().trim().optional(),
    });
    const organization = values();

    const data = profileSchema.safeParse(organization);

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
    contactPhone,
    setContactPhone,
    city,
    setCity,
    country,
    setCountry,
    values,
    validate,
  };
};
