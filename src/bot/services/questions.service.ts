/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { IPokemon } from 'pokeapi-typescript';
import * as sharp from 'sharp';
import { Hint } from 'src/entities/hint.entity';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(Hint)
    private hintsRepository: Repository<Hint>,
  ) {}

  async getQuestion(user: User) {
    const ceilPokedex = parseInt(process.env.POKEDEX_CEIL);
    const randomA = Math.ceil(Math.random() * (ceilPokedex / 2));
    const randomB = Math.ceil(Math.random() * (ceilPokedex / 2) - 1);
    const randomId = randomA + randomB;

    const pokeApi = require('pokeapi-typescript');
    const pokemon: IPokemon = await pokeApi.Pokemon.resolve(randomId);
    const pokeImageUrl = pokemon.sprites.front_default;
    const pokemonImage = await this.getImage(pokeImageUrl);
    const pokemonType = await this.getPokemonTypeSpanish(pokemon);
    const pokemonMove = await this.getPokemonMoveSpanish(pokemon);
    const pokemonName = pokemon.name.toLowerCase();
    await this.saveQuestion(
      pokemonName,
      pokemonType,
      pokemonMove,
      pokeImageUrl,
      user,
    );
    return pokemonImage;
  }

  private async getImage(imageUrl: string) {
    const image = (await axios({ url: imageUrl, responseType: 'arraybuffer' }))
      .data as Buffer;
    const background = (
      await axios({
        url: process.env.BACKGROUND_URL,
        responseType: 'arraybuffer',
      })
    ).data as Buffer;
    const processedImage = await sharp(image)
      .resize(null, 180)
      .threshold(255)
      .linear(0, 0)
      .toBuffer();
    const finalImage = sharp(background)
      .composite([{ input: processedImage, top: 40, left: 40 }])
      .toBuffer();
    return finalImage;
  }

  private async getPokemonTypeSpanish(pokemon: IPokemon) {
    const typeEngUrl = pokemon.types[0].type.url;
    const typeInfo = await (
      await axios({ url: typeEngUrl, responseType: 'json' })
    ).data;
    const typeEs = typeInfo.names.filter(
      (type) => type.language.name === 'es',
    )[0].name;
    return typeEs;
  }

  private async getPokemonMoveSpanish(pokemon: IPokemon) {
    const moveUrl = pokemon.moves[0].move.url;
    const moveData = await (
      await axios({ url: moveUrl, responseType: 'json' })
    ).data;
    const moveEs = moveData.names.filter(
      (move) => move.language.name === 'es',
    )[0].name;
    return moveEs;
  }

  private async saveQuestion(
    pokemonName: string,
    pokemonType: string,
    pokemonMove: string,
    imageUrl: string,
    user: User,
  ) {
    const question = this.questionsRepository.create({
      user: user,
      currentHint: 0,
      answer: pokemonName,
      imageUrl,
    });
    const newQuestion = await this.questionsRepository.save(question);
    const typeHint = this.hintsRepository.create({
      question: newQuestion,
      hintOrder: 1,
      hintName: 'Type',
      hintValue: pokemonType,
    });
    const moveHint = this.hintsRepository.create({
      question: newQuestion,
      hintOrder: 2,
      hintName: 'Move',
      hintValue: pokemonMove,
    });
    await this.hintsRepository.save([typeHint, moveHint]);
  }
}
