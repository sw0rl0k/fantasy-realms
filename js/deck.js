var deck = {
  cards: [
    {
      id: 1,
      suit: "Land",
      name: "Mountain",
      localizedSuit: "Земля",
      localizedName: "Гора",
      strength: 9,
      bonus:
        '+50 вместе с <span class="weather">дымом</span> и <span class="flame">пожаром</span>. <br />Отменяет штрафы на всех <span class="flood">потопах</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Smoke") && hand.contains("Wildfire") ? 50 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === "Flood";
      },
      relatedSuits: ["Flood"],
      relatedCards: ["Smoke", "Wildfire"]
    },
    {
      id: 2,
      suit: "Land",
      name: "Cavern",
      localizedSuit: "Земля",
      localizedName: "Пещера",
      strength: 6,
      bonus:
        '+25 вместе с <span class="army">гномьей пехотой</span> или <span class="beast">драконом</span>. <br />Отменяет штрафы на всех картах <span class="weather">погоды</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Dwarvish Infantry") || hand.contains("Dragon")
          ? 25
          : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === "Weather";
      },
      relatedSuits: ["Weather"],
      relatedCards: ["Dwarvish Infantry", "Dragon"]
    },
    {
      id: 3,
      suit: "Land",
      name: "Bell Tower",
      localizedSuit: "Земля",
      localizedName: "Колокольня",
      strength: 8,
      bonus: '+15 вместе с любым <span class="wizard">колдуном</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit("Wizard") ? 15 : 0;
      },
      relatedSuits: ["Wizard"],
      relatedCards: []
    },
    {
      id: 4,
      suit: "Land",
      name: "Forest",
      localizedSuit: "Земля",
      localizedName: "Лес",
      strength: 7,
      bonus:
        '+12 за каждого <span class="beast">зверя</span> и <span class="army">эльфов-стрелков</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (
          12 * hand.countSuit("Beast") +
          (hand.contains("Elven Archers") ? 12 : 0)
        );
      },
      relatedSuits: ["Beast"],
      relatedCards: ["Elven Archers"]
    },
    {
      id: 5,
      suit: "Land",
      name: "Earth Elemental",
      localizedSuit: "Земля",
      localizedName: "Дух земли",
      strength: 4,
      bonus: '+15 за каждую другую <span class="land">Землю</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding("Land", this.id);
      },
      relatedSuits: ["Land"],
      relatedCards: []
    },
    {
      id: 6,
      suit: "Flood",
      name: "Fountain of Life",
      localizedSuit: "Потоп",
      localizedName: "Фонтан жизни",
      strength: 1,
      bonus:
        'Прибавьте основную силу любого <span class="weapon">оружия</span>, <span class="flood">потопа</span>, <span class="flame">пламени</span>, <span class="land">земли</span> или <span class="weather">погоды</span>.',
      penalty: null,
      bonusScore: function(hand) {
        var max = 0;
        for (const card of hand.nonBlankedCards()) {
          if (
            card.suit === "Weapon" ||
            card.suit === "Flood" ||
            card.suit === "Flame" ||
            card.suit === "Land" ||
            card.suit === "Weather"
          ) {
            if (card.strength > max) {
              max = card.strength;
            }
          }
        }
        return max;
      },
      relatedSuits: ["Weapon", "Flood", "Flame", "Land", "Weather"],
      relatedCards: []
    },
    {
      id: 7,
      suit: "Flood",
      name: "Swamp",
      localizedSuit: "Потоп",
      localizedName: "Болото",
      strength: 18,
      bonus: null,
      penalty:
        '-3 за каждое <span class="army">войско</span> и <span class="flame">пламя</span>.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit("Flame");
        if (!(hand.containsId(25) || hand.containsId(41))) {
          // these clear the word 'Army' from the penalty
          penaltyCards += hand.countSuit("Army");
        }
        return -3 * penaltyCards;
      },
      relatedSuits: ["Army", "Flame"],
      relatedCards: []
    },
    {
      id: 8,
      suit: "Flood",
      name: "Great Flood",
      localizedSuit: "Потоп",
      localizedName: "Великий Потоп",
      strength: 32,
      bonus: null,
      penalty:
        'Блокирует все <span class="army">войска</span>, все <span class="land">земли</span> кроме <span class="land">горы</span>, и всё <span class="flame">пламя</span> кроме <span class="flame">молнии</span>.',
      blanks: function(card, hand) {
        return (
          (card.suit === "Army" &&
            !(hand.containsId(25) || hand.containsId(41))) || // these clear the word 'Army' from the penalty
          (card.suit === "Land" && card.name !== "Mountain") ||
          (card.suit === "Flame" && card.name !== "Lightning")
        );
      },
      relatedSuits: ["Army", "Land", "Flame"],
      relatedCards: ["Mountain", "Lightning"]
    },
    {
      id: 9,
      suit: "Flood",
      name: "Island",
      localizedSuit: "Потоп",
      localizedName: "Остров",
      strength: 14,
      bonus:
        'Отменяет штраф на любом <span class="flood">потопе</span> или <span class="flame">пламени</span>.',
      penalty: null,
      action: "Выберите потоп или пламя в вашей руке для отмены.",
      relatedSuits: ["Flood", "Flame"],
      relatedCards: []
    },
    {
      id: 10,
      suit: "Flood",
      name: "Water Elemental",
      localizedSuit: "Потоп",
      localizedName: "Дух воды",
      strength: 4,
      bonus: '+15 за каждый другой <span class="flood">потоп</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding("Flood", this.id);
      },
      relatedSuits: ["Flood"],
      relatedCards: []
    },
    {
      id: 11,
      suit: "Weather",
      name: "Rainstorm",
      localizedSuit: "Погода",
      localizedName: "Ливень",
      strength: 8,
      bonus: '+10 за каждый <span class="flood">потоп</span>.',
      penalty:
        'Блокирует всё <span class="flame">пламя</span> кроме <span class="flame">молнии</span>.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit("Flood");
      },
      blanks: function(card, hand) {
        return card.suit === "Flame" && card.name !== "Lightning";
      },
      relatedSuits: ["Flood", "Flame"],
      relatedCards: ["Lightning"]
    },
    {
      id: 12,
      suit: "Weather",
      name: "Blizzard",
      localizedSuit: "Погода",
      localizedName: "Метель",
      strength: 30,
      bonus: null,
      penalty:
        'Блокирует все <span class="flood">потопы</span>. <br />-5 за каждое <span class="army">войско</span>, <span class="leader">правителя</span>, <span class="beast">зверя</span>, и <span class="flame">пламя</span>.',
      penaltyScore: function(hand) {
        var penaltyCards =
          hand.countSuit("Leader") +
          hand.countSuit("Beast") +
          hand.countSuit("Flame");
        if (!hand.containsId(25)) {
          // clears the word 'Army' from the penalty
          penaltyCards += hand.countSuit("Army");
        }
        return -5 * penaltyCards;
      },
      blanks: function(card, hand) {
        return card.suit === "Flood";
      },
      relatedSuits: ["Leader", "Beast", "Flame", "Army", "Flood"],
      relatedCards: []
    },
    {
      id: 13,
      suit: "Weather",
      name: "Smoke",
      localizedSuit: "Погода",
      localizedName: "Дым",
      strength: 27,
      bonus: null,
      penalty:
        'Блокируется, если у вас нет ни одного <span class="flame">пламени</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit("Flame");
      },
      relatedSuits: ["Flame"],
      relatedCards: []
    },
    {
      id: 14,
      suit: "Weather",
      name: "Whirlwind",
      localizedSuit: "Погода",
      localizedName: "Ураган",
      strength: 13,
      bonus:
        '+40 вместе с <span class="weather">ливнем</span> и либо <span class="weather">метелью</span>, либо <span class="flood">великим потопом</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Rainstorm") &&
          (hand.contains("Blizzard") || hand.contains("Great Flood"))
          ? 40
          : 0;
      },
      relatedSuits: ["Rainstorm"],
      relatedCards: ["Blizzard", "Great Flood"]
    },
    {
      id: 15,
      suit: "Weather",
      name: "Air Elemental",
      localizedSuit: "Погода",
      localizedName: "Дух воздуха",
      strength: 4,
      bonus: '+15 за каждую другую <span class="weather">погоду</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding("Weather", this.id);
      },
      relatedSuits: ["Weather"],
      relatedCards: []
    },
    {
      id: 16,
      suit: "Flame",
      name: "Wildfire",
      localizedSuit: "Пламя",
      localizedName: "Пожар",
      strength: 40,
      bonus: null,
      penalty:
        'Блокируются все карты, кроме <span class="flame">пламени</span>, <span class="wizard">колдунов</span>, <span class="weather">погоды</span>, <span class="weapon">оружия</span>, <span class="artifact">артефактов</span>, <span class="land">горы</span>, <span class="flood">великого потопа</span>, <span class="flood">острова</span>, <span class="beast">единорога</span> и <span class="beast">дракона</span>.',
      blanks: function(card, hand) {
        return !(
          card.suit === "Flame" ||
          card.suit === "Wizard" ||
          card.suit === "Weather" ||
          card.suit === "Weapon" ||
          card.suit === "Artifact" ||
          card.suit === "Wild" ||
          card.name === "Mountain" ||
          card.name === "Great Flood" ||
          card.name === "Island" ||
          card.name === "Unicorn" ||
          card.name === "Dragon"
        );
      },
      relatedSuits: allSuits(),
      relatedCards: ["Mountain", "Great Flood", "Island", "Unicorn", "Dragon"]
    },
    {
      id: 17,
      suit: "Flame",
      name: "Candle",
      localizedSuit: "Пламя",
      localizedName: "Свеча",
      strength: 2,
      bonus:
        '+100 вместе с <span class="artifact">книгой перемен</span>, <span class="land">колокольней</span>, и любым <span class="wizard">колдуном</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Book of Changes") &&
          hand.contains("Bell Tower") &&
          hand.containsSuit("Wizard")
          ? 100
          : 0;
      },
      relatedSuits: ["Wizard"],
      relatedCards: ["Book of Changes", "Bell Tower"]
    },
    {
      id: 18,
      suit: "Flame",
      name: "Forge",
      localizedSuit: "Пламя",
      localizedName: "Кузница",
      strength: 9,
      bonus:
        '+9 за каждое <span class="weapon">оружие</span> и <span class="artifact">артефакт</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * (hand.countSuit("Weapon") + hand.countSuit("Artifact"));
      },
      relatedSuits: ["Weapon", "Artifact"],
      relatedCards: []
    },
    {
      id: 19,
      suit: "Flame",
      name: "Lightning",
      localizedSuit: "Пламя",
      localizedName: "Молния",
      strength: 11,
      bonus: '+30 вместе с <span class="weather">ливнем</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Rainstorm") ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ["Rainstorm"]
    },
    {
      id: 20,
      suit: "Flame",
      name: "Fire Elemental",
      localizedSuit: "Пламя",
      localizedName: "Дух огня",
      strength: 4,
      bonus: '+15 за каждое другое <span class="flame">пламя</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding("Flame", this.id);
      },
      relatedSuits: ["Flame"],
      relatedCards: []
    },
    {
      id: 21,
      suit: "Army",
      name: "Knights",
      localizedSuit: "Войско",
      localizedName: "Рыцари",
      strength: 20,
      bonus: null,
      penalty:
        '-8, если у вас нет ни одного <span class="leader">правителя</span>.',
      penaltyScore: function(hand) {
        return hand.containsSuit("Leader") ? 0 : -8;
      },
      relatedSuits: ["Leader"],
      relatedCards: []
    },
    {
      id: 22,
      suit: "Army",
      name: "Elven Archers",
      localizedSuit: "Войско",
      localizedName: "Эльфы-стрелки",
      strength: 10,
      bonus: '+5, если у вас нет ни одной <span class="weather">погоды</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit("Weather") ? 0 : 5;
      },
      relatedSuits: ["Weather"],
      relatedCards: []
    },
    {
      id: 23,
      suit: "Army",
      name: "Light Cavalry",
      localizedSuit: "Войско",
      localizedName: "Кавалерия",
      strength: 17,
      bonus: null,
      penalty: '-2 за каждую <span class="land">землю</span>.',
      penaltyScore: function(hand) {
        return -2 * hand.countSuit("Land");
      },
      relatedSuits: ["Land"],
      relatedCards: []
    },
    {
      id: 24,
      suit: "Army",
      name: "Dwarvish Infantry",
      localizedSuit: "Войско",
      localizedName: "Гномья пехота",
      strength: 15,
      bonus: null,
      penalty: '-2 за каждое другое <span class="army">войско</span>.',
      penaltyScore: function(hand) {
        if (!hand.containsId(25)) {
          // clears the word 'Army' from the penalty
          return -2 * hand.countSuitExcluding("Army", this.id);
        }
        return 0;
      },
      relatedSuits: ["Army"],
      relatedCards: []
    },
    {
      id: 25,
      suit: "Army",
      name: "Rangers",
      localizedSuit: "Войско",
      localizedName: "Егеря",
      strength: 5,
      bonus:
        '+10 за каждую <span class="land">землю</span>. <br />Удаляет слово <span class="army">войско</span> из всех штрафов.',
      penalty: null,
      bonusScore: function(hand) {
        return 10 * hand.countSuit("Land");
      },
      relatedSuits: ["Land", "Army"],
      relatedCards: []
    },
    {
      id: 26,
      suit: "Wizard",
      name: "Collector",
      localizedSuit: "Колдун",
      localizedName: "Собиратель",
      strength: 7,
      bonus:
        "+10 за три разные карты одной масти, +40 за четыре разные карты одной масти, +100  за пять разных карт одной масти.",
      penalty: null,
      bonusScore: function(hand) {
        var bySuit = {};
        for (const card of hand.nonBlankedCards()) {
          var suit = card.suit;
          if (bySuit[suit] === undefined) {
            bySuit[suit] = {};
          }
          bySuit[suit][card.name] = card;
        }
        var bonus = 0;
        for (const suit of Object.values(bySuit)) {
          var count = Object.keys(suit).length;
          if (count === 3) {
            bonus += 10;
          } else if (count === 4) {
            bonus += 40;
          } else if (count >= 5) {
            bonus += 100;
          }
        }
        return bonus;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 27,
      suit: "Wizard",
      name: "Beastmaster",
      localizedSuit: "Колдун",
      localizedName: "Зверолов",
      strength: 9,
      bonus:
        '+9 за каждого <span class="beast">зверя</span>. <br />Отменяет штрафы на всех <span class="beast">зверях</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * hand.countSuit("Beast");
      },
      clearsPenalty: function(card) {
        return card.suit === "Beast";
      },
      relatedSuits: ["Beast"],
      relatedCards: []
    },
    {
      id: 28,
      suit: "Wizard",
      name: "Necromancer",
      localizedSuit: "Колдун",
      localizedName: "Некромант",
      strength: 3,
      bonus:
        'В конце игры можете взять из стопки сброса одно <span class="army">войско</span>, <span class="leader">правителя</span>, <span class="wizard">колдуна</span>, или <span class="beast">зверя</span> и добавить себе на руку в качестве восьмой карты.',
      penalty: null,
      relatedSuits: ["Army", "Leader", "Wizard", "Beast"],
      relatedCards: []
    },
    {
      id: 29,
      suit: "Wizard",
      name: "Warlock Lord",
      localizedSuit: "Колдун",
      localizedName: "Чернокнижник",
      strength: 25,
      bonus: null,
      penalty:
        '-10 за каждого <span class="leader">правителя</span> и других <span class="wizard">колдунов</span>.',
      penaltyScore: function(hand) {
        return (
          -10 *
          (hand.countSuit("Leader") +
            hand.countSuitExcluding("Wizard", this.id))
        );
      },
      relatedSuits: ["Leader", "Wizard"],
      relatedCards: []
    },
    {
      id: 30,
      suit: "Wizard",
      name: "Enchantress",
      localizedSuit: "Колдун",
      localizedName: "Чародейка",
      strength: 5,
      bonus:
        '+5 за каждую <span class="land">землю</span>, <span class="weather">погоду</span>, <span class="flood">потоп</span>, и <span class="flame">пламя</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (
          5 *
          (hand.countSuit("Land") +
            hand.countSuit("Weather") +
            hand.countSuit("Flood") +
            hand.countSuit("Flame"))
        );
      },
      relatedSuits: ["Land", "Weather", "Flood", "Flame"],
      relatedCards: []
    },
    {
      id: 31,
      suit: "Leader",
      name: "King",
      localizedSuit: "Правитель",
      localizedName: "Король",
      strength: 8,
      bonus:
        '+5 за каждое <span class="army">войско</span>. <br />Или +20 за каждое <span class="army">войско</span> если вместе с <span class="leader">королевой</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains("Queen") ? 20 : 5) * hand.countSuit("Army");
      },
      relatedSuits: ["Army"],
      relatedCards: ["Queen"]
    },
    {
      id: 32,
      suit: "Leader",
      name: "Queen",
      localizedSuit: "Правитель",
      localizedName: "Королева",
      strength: 6,
      bonus:
        '+5 за каждое <span class="army">войско</span>. <br />Или +20 за каждое <span class="army">войско</span> если вместе с <span class="leader">королём</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains("King") ? 20 : 5) * hand.countSuit("Army");
      },
      relatedSuits: ["Army"],
      relatedCards: ["King"]
    },
    {
      id: 33,
      suit: "Leader",
      name: "Princess",
      localizedSuit: "Правитель",
      localizedName: "Принцесса",
      strength: 2,
      bonus:
        '+8 за каждое <span class="army">войско</span>, <span class="wizard">колдунов</span>, и других <span class="leader">правителей</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (
          8 *
          (hand.countSuit("Army") +
            hand.countSuit("Wizard") +
            hand.countSuitExcluding("Leader", this.id))
        );
      },
      relatedSuits: ["Army", "Wizard", "Leader"],
      relatedCards: []
    },
    {
      id: 34,
      suit: "Leader",
      name: "Warlord",
      localizedSuit: "Правитель",
      localizedName: "Военачальник",
      strength: 4,
      bonus: 'Сумма основных сил всех <span class="army">войск</span>.',
      penalty: null,
      bonusScore: function(hand) {
        var total = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === "Army") {
            total += card.strength;
          }
        }
        return total;
      },
      relatedSuits: ["Army"],
      relatedCards: []
    },
    {
      id: 35,
      suit: "Leader",
      name: "Empress",
      localizedSuit: "Правитель",
      localizedName: "Императрица",
      strength: 15,
      bonus: '+10 за каждое <span class="army">войско</span>.',
      penalty: '-5 за каждого другого <span class="leader">правителя</span>.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit("Army");
      },
      penaltyScore: function(hand) {
        return -5 * hand.countSuitExcluding("Leader", this.id);
      },
      relatedSuits: ["Army", "Leader"],
      relatedCards: []
    },
    {
      id: 36,
      suit: "Beast",
      name: "Unicorn",
      localizedSuit: "Зверь",
      localizedName: "Единорог",
      strength: 9,
      bonus:
        '+30 вместе с <span class="leader">принцессой</span>. <br />или +15 вместе с <span class="leader">императрицей</span>, <span class="leader">королевой</span>, или <span class="leader">чародейкой</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Princess")
          ? 30
          : hand.contains("Empress") ||
            hand.contains("Queen") ||
            hand.contains("Enchantress")
          ? 15
          : 0;
      },
      relatedSuits: [],
      relatedCards: ["Princess", "Empress", "Queen", "Enchantress"]
    },
    {
      id: 37,
      suit: "Beast",
      name: "Basilisk",
      localizedSuit: "Зверь",
      localizedName: "Василиск",
      strength: 35,
      bonus: null,
      penalty:
        'Блокирует все <span class="army">войска</span>, <span class="leader">правителей</span>, и других <span class="beast">зверей</span>.',
      blanks: function(card, hand) {
        return (
          (card.suit === "Army" && !hand.containsId(25)) || // clears the word 'Army' from the penalty
          card.suit === "Leader" ||
          (card.suit === "Beast" && card.id !== this.id)
        );
      },
      relatedSuits: ["Army", "Leader", "Beast"],
      relatedCards: []
    },
    {
      id: 38,
      suit: "Beast",
      name: "Warhorse",
      localizedSuit: "Зверь",
      localizedName: "Боевой конь",
      strength: 6,
      bonus:
        '+14 вместе с любым <span class="leader">правителей</span> или <span class="wizard">колдуном</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit("Leader") || hand.containsSuit("Wizard")
          ? 14
          : 0;
      },
      relatedSuits: ["Leader", "Wizard"],
      relatedCards: []
    },
    {
      id: 39,
      suit: "Beast",
      name: "Dragon",
      localizedSuit: "Зверь",
      localizedName: "Дракон",
      strength: 30,
      bonus: null,
      penalty:
        '-40 если у вас нет ни одного <span class="wizard">колдуна</span>.',
      penaltyScore: function(hand) {
        return hand.containsSuit("Wizard") ? 0 : -40;
      },
      relatedSuits: ["Wizard"],
      relatedCards: []
    },
    {
      id: 40,
      suit: "Beast",
      name: "Hydra",
      localizedSuit: "Зверь",
      localizedName: "Гидра",
      strength: 12,
      bonus: '+28 вместе с <span class="flood">болотом</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Swamp") ? 28 : 0;
      },
      relatedSuits: [],
      relatedCards: ["Swamp"]
    },
    {
      id: 41,
      suit: "Weapon",
      name: "Warship",
      localizedSuit: "Оружие",
      localizedName: "Драккар",
      strength: 23,
      bonus:
        'Отменяет штрафы за <span class="army">войска</span> на всех <span class="flood">потопах</span>.',
      penalty:
        'Блокируется, если у вас нет ни одного <span class="flood">потопа</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit("Flood");
      },
      relatedSuits: ["Army", "Flood"],
      relatedCards: []
    },
    {
      id: 42,
      suit: "Weapon",
      name: "Magic Wand",
      localizedSuit: "Оружие",
      localizedName: "Жезл",
      strength: 1,
      bonus: '+25 вместе с любым <span class="wizard">колдуном</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit("Wizard") ? 25 : 0;
      },
      relatedSuits: ["Wizard"],
      relatedCards: []
    },
    {
      id: 43,
      suit: "Weapon",
      name: "Sword of Keth",
      localizedSuit: "Оружие",
      localizedName: "Меч Кета",
      strength: 7,
      bonus:
        '+10 вместе с любым <span class="leader">правителем</span>. <br />Или +40 вместе с <span class="leader">правителем</span> и <span class="artifact">щитом Кета</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit("Leader")
          ? hand.contains("Shield of Keth")
            ? 40
            : 10
          : 0;
      },
      relatedSuits: ["Leader"],
      relatedCards: ["Shield of Keth"]
    },
    {
      id: 44,
      suit: "Weapon",
      name: "Elven Longbow",
      localizedSuit: "Оружие",
      localizedName: "Длинный лук",
      strength: 3,
      bonus:
        '+30 вместе с <span class="army">эльфами-стрелками</span>, <span class="leader">военачальником</span> или <span class="wizard">звереловом</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains("Elven Archers") ||
          hand.contains("Warlord") ||
          hand.contains("Beastmaster")
          ? 30
          : 0;
      },
      relatedSuits: [],
      relatedCards: ["Elven Archers", "Warlord", "Beastmaster"]
    },
    {
      id: 45,
      suit: "Weapon",
      name: "War Dirigible",
      localizedSuit: "Оружие",
      localizedName: "Дирижабль",
      strength: 35,
      bonus: null,
      penalty:
        'Блокируется, если у вас нет ни одного <span class="army">войска</span>. <br />Блокируется вместе с любой <span class="weather">погодой</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit("Army") || hand.containsSuit("Weather");
      },
      relatedSuits: ["Army", "Weather"],
      relatedCards: []
    },
    {
      id: 46,
      suit: "Artifact",
      name: "Shield of Keth",
      localizedSuit: "Артефакт",
      localizedName: "Щит Кета",
      strength: 4,
      bonus:
        '+15 вместе с любым <span class="leader">правителем</span>. <br />Или +40 вместе с <span class="leader">правителем</span> и <span class="weapon">мечом Кета</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit("Leader")
          ? hand.contains("Sword of Keth")
            ? 40
            : 15
          : 0;
      },
      relatedSuits: ["Leader"],
      relatedCards: ["Sword of Keth"]
    },
    {
      id: 47,
      suit: "Artifact",
      name: "Gem of Order",
      localizedSuit: "Артефакт",
      localizedName: "Камень порядка",
      strength: 5,
      bonus:
        "+10 за ряд из 3 карт, +30 за ряд из 4 карт, +60 fза ряд из 5 карт, +100 за ряд из 6 карт, +150 за ряд из 7 карт. <br />(Это относится к числовому значению основной силы.)",
      penalty: null,
      bonusScore: function(hand) {
        var strengths = hand.nonBlankedCards().map(card => card.strength);
        var currentRun = 0;
        var runs = [];
        for (var i = 0; i <= 40; i++) {
          if (strengths.includes(i)) {
            currentRun++;
          } else {
            runs.push(currentRun);
            currentRun = 0;
          }
        }
        var bonus = 0;
        for (var run of runs) {
          if (run === 3) {
            bonus += 10;
          } else if (run === 4) {
            bonus += 30;
          } else if (run === 5) {
            bonus += 60;
          } else if (run === 6) {
            bonus += 100;
          } else if (run >= 7) {
            bonus += 150;
          }
        }
        return bonus;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 48,
      suit: "Artifact",
      name: "World Tree",
      localizedSuit: "Артефакт",
      localizedName: "Мировое дерево",
      strength: 2,
      bonus: "+50 если каждая незаблокированная карта имеет другую масть.",
      penalty: null,
      bonusScore: function(hand) {
        var suits = [];
        for (const card of hand.nonBlankedCards()) {
          if (suits.includes(card.suit)) {
            return 0;
          }
          suits.push(card.suit);
        }
        return 50;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 49,
      suit: "Artifact",
      name: "Book of Changes",
      localizedSuit: "Артефакт",
      localizedName: "Книга перемен",
      strength: 3,
      bonus:
        "Можете изменить масть одной другой карты; её название, бонусы и штрафы не изменяются.",
      penalty: null,
      action: "Выберите масть и целевую карту в вашей руке.",
      relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
      relatedCards: []
    },
    {
      id: 50,
      suit: "Artifact",
      name: "Protection Rune",
      localizedSuit: "Артефакт",
      localizedName: "Рунный оберег",
      strength: 1,
      bonus: "Отменяет штрафы всех карт.",
      penalty: null,
      clearsPenalty: function(card) {
        return true;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 51,
      suit: "Wild",
      name: "Shapeshifter",
      localizedSuit: "Джокер",
      localizedName: "Оборотень",
      strength: 0,
      bonus:
        'Может копировать название и масть любого <span class="artifact">артифакта</span>, <span class="leader">правителя</span>, <span class="wizard">колдуна</span>, <span class="weapon">оружия</span> или <span class="beast">зверя</span> в игре. <br />Не получает бонуса, штрафа и основную силу скопированной карты.',
      penalty: null,
      action: "Выберите карту для копирования.",
      relatedSuits: ["Artifact", "Leader", "Wizard", "Weapon", "Beast"].sort(),
      relatedCards: []
    },
    {
      id: 52,
      suit: "Wild",
      name: "Mirage",
      localizedSuit: "Джокер",
      localizedName: "Мираж",
      strength: 0,
      bonus:
        'Может копировать название и масть любого <span class="army">войска</span>, <span class="land">земли</span>, <span class="weather">погоды</span>, <span class="flood">потопа</span> или <span class="flame">пламени</span> в игре. <br />Не получает бонуса, штрафа и основную силу скопированной карты.',
      penalty: null,
      action: "Выберите карту для копирования.",
      relatedSuits: ["Army", "Land", "Weather", "Flood", "Flame"].sort(),
      relatedCards: []
    },
    {
      id: 53,
      suit: "Wild",
      name: "Doppelgänger",
      localizedSuit: "Джокер",
      localizedName: "Двойник",
      strength: 0,
      bonus:
        "Может копировать название, основную силу, масть и штраф, но не бонус одной другой карты у вас на руке",
      penalty: null,
      action: "Выберите карту из руки для копирования.",
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 54,
      suit: "Wizard",
      name: "Jester",
      localizedName: "Шут",
      strength: 3,
      bonus:
        "+3 за каждую другую карту с нечётным значением основной силы. <br />Или +50 если вся рука имеет нечётные значения основной силы.",
      penalty: null,
      bonusScore: function(hand) {
        var oddCount = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.strength % 2 === 1) {
            oddCount++;
          }
        }
        if (oddCount === hand.size()) {
          return 50;
        } else {
          return (oddCount - 1) * 3;
        }
      },
      relatedSuits: [],
      relatedCards: []
    }
  ],
  getCardByName: function(cardName) {
    for (const card of this.cards) {
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function(id) {
    return this.cards[id - 1];
  },
  getCardsBySuit: function(suits) {
    var cardsBySuit = {};
    for (const card of this.cards) {
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    Object.keys(cardsBySuit)
      .sort()
      .forEach(function(key) {
        ordered[key] = cardsBySuit[key];
      });
    return ordered;
  }
};

function allSuits() {
  return [
    "Land",
    "Flood",
    "Weather",
    "Flame",
    "Army",
    "Wizard",
    "Leader",
    "Beast",
    "Weapon",
    "Artifact",
    "Wild"
  ].sort();
}

var NONE = -1;
var ISLAND = 9;
var NECROMANCER = 28;
var BOOK_OF_CHANGES = 49;
var SHAPESHIFTER = 51;
var MIRAGE = 52;
var DOPPELGANGER = 53;

var ACTION_ORDER = [
  DOPPELGANGER,
  MIRAGE,
  SHAPESHIFTER,
  BOOK_OF_CHANGES,
  ISLAND
];
