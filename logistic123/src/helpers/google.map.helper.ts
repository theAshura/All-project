// import {LatLngLiteral} from 'components/common/google-map/GoogleMap'

export const codeAddress = (address: string) => {
  const geocoder = new window.google.maps.Geocoder();
  let lat = null;
  let lng = null;
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK') {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
    }
  });

  return { lat, lng };
};

export const getLatLngByAddress = async (address: string) => {
  try {
    const geocoder = new window.google.maps.Geocoder();
    const res = await geocoder.geocode({ address });
    const { results } = res;
    if (results?.[0]?.geometry?.location?.lat) {
      const lat = results[0].geometry.location.lat() || null;
      const lng = results[0].geometry.location.lng() || null;
      return { lat, lng };
    }
    return { lat: null, lng: null };
  } catch (error) {
    return { lat: null, lng: null };
  }
};

export const convertDMSToDD = (dms: string) => {
  if (!dms) {
    return null;
  }
  // eslint-disable-next-line no-useless-escape
  const parts = dms?.split(/[^\d+(\,\d+)\d+(\.\d+)?\w]+/);
  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]?.replace(',', '.'));
  const direction = parts[3];

  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction === 'S' || direction === 'W') {
    dd *= -1;
  } // Don't do anything for N or E
  return dd;
};

export const parseDMS = (latDMST: string, lngDMST: string) => {
  const lat = latDMST && convertDMSToDD(latDMST);
  const lng = lngDMST && convertDMSToDD(lngDMST);
  return { lat, lng };
};

export const loadGoogleMap = (src: string) => {
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = src;
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(tag);
};
