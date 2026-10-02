import { Image } from 'react-native';

/** Remote demo portraits (used if local asset resolve fails). */
const REMOTE: Record<string, string> = {
  p1: 'https://randomuser.me/api/portraits/women/44.jpg',
  p2: 'https://randomuser.me/api/portraits/men/32.jpg',
  p3: 'https://randomuser.me/api/portraits/women/68.jpg',
  p4: 'https://randomuser.me/api/portraits/men/52.jpg',
  p5: 'https://randomuser.me/api/portraits/women/65.jpg',
  p6: 'https://randomuser.me/api/portraits/men/75.jpg',
  p7: 'https://randomuser.me/api/portraits/women/33.jpg',
  p8: 'https://randomuser.me/api/portraits/women/47.jpg',
  p9: 'https://randomuser.me/api/portraits/women/90.jpg',
  p10: 'https://randomuser.me/api/portraits/men/11.jpg',
};

/** Local bundled portraits under assets/placeholders (preferred on device). */
const ASSETS: Record<string, number> = {
  p1: require('../../assets/placeholders/p1.jpg'),
  p2: require('../../assets/placeholders/p2.jpg'),
  p3: require('../../assets/placeholders/p3.jpg'),
  p4: require('../../assets/placeholders/p4.jpg'),
  p5: require('../../assets/placeholders/p5.jpg'),
  p6: require('../../assets/placeholders/p6.jpg'),
  p7: require('../../assets/placeholders/p7.jpg'),
  p8: require('../../assets/placeholders/p8.jpg'),
  p9: require('../../assets/placeholders/p9.jpg'),
  p10: require('../../assets/placeholders/p10.jpg'),
};

/** Resolve a mock profile id to a URI usable in Image / photo_urls. */
export function mockPhotoUrl(profileId: string): string {
  try {
    const asset = ASSETS[profileId];
    if (asset) {
      const resolved = Image.resolveAssetSource(asset);
      if (resolved?.uri) return resolved.uri;
    }
  } catch {
    // fall through to remote
  }
  return REMOTE[profileId] ?? '';
}

export function mockPhotoUrls(profileId: string): string[] {
  const uri = mockPhotoUrl(profileId);
  return uri ? [uri] : [];
}
