import { Image } from 'react-native';

/**
 * Local demo portrait assets for mock Discover/Matches/Chat.
 * Bundled under assets/placeholders so sample users show real images offline.
 */
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

/** Resolve a mock profile id to a packager URI usable in Image / photo_urls. */
export function mockPhotoUrl(profileId: string): string {
  const asset = ASSETS[profileId];
  if (!asset) return '';
  const resolved = Image.resolveAssetSource(asset);
  return resolved?.uri ?? '';
}

export function mockPhotoUrls(profileId: string): string[] {
  const uri = mockPhotoUrl(profileId);
  return uri ? [uri] : [];
}
