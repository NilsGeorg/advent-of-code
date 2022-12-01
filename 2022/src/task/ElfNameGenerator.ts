class ElfNameGenerator {
    getRandomElfName = () => ELF_NAMES[Math.floor(Math.random() * ELF_NAMES.length)];

    getElfNameByIndex(index: number): string {
        if (index >= ELF_NAMES.length) {
            index = index % ELF_NAMES.length
        }

        if (index < 0) {
            index = 0
        }

        return ELF_NAMES[index]
    }
}

export default new ElfNameGenerator()

export const ELF_NAMES = [
    'Merry',
    'Snowflake',
    'Noel',
    'Hope',
    'Bell',
    'Ivy',
    'Snowy',
    'Balsam',
    'Frosty',
    'Hope',
    'Jolly',
    'Joy',
    'Star',
    'Faith',
    'Snowball',
    'Fa-La-La',
    'Rockefeller',
    'Holly',
    'Casper',
    'Tinsel',
    'Sugarplum ',
    'Fruitcake',
    'Eggnog',
    'Honey',
    'Cinnamon',
    'Sprinkle',
    'Spice',
    'Peppermint',
    'Gingerbread',
    'Marshmallow',
    'Red Velvet',
    'Toffee',
    'Gingersnap',
    'Cherry',
    'Butterscotch',
    'Cannoli',
    'Snickerdoodle',
    'Candy',
    'Sugar',
    'Candy Cane',
    'Fudgie',
    'Cocoa ',
    'Sawyer',
    'Buck',
    'Lasso',
    'Chance',
    'Annie',
    'Denver',
    'Billy',
    'Davy',
    'Arizona',
    'Nash',
    'Cheyenne',
    'Ryder',
    'Blaze',
    'West',
    'Dakota',
    'Colt',
    'Ford',
    'Graham',
    'Jesse',
    'Cody',
    'Hank',
]
