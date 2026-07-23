module.exports = {
  name: /^$|^[^|"]+$/,
  postcode: /^$|(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/,
  phone: /^$|^(0[012345689][0-9]{8,9})$|(07[0-9]{9})$/,
  phoneSpaces: /^[0-9 +]{8,15}$/,
  year: /^[0-9]{4}$/,
  dayMonth: /^[0-9]{1,2}$/,
};
