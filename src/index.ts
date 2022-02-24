import "reflect-metadata";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  ArgsType,
  Int,
  Args,
  buildTypeDefsAndResolvers,
  ID,
} from "type-graphql";
import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "@graphql-tools/schema";

@ObjectType({ description: "recipe model" })
class Recipe {
  @Field((type) => ID)
  id: string;

  @Field({ description: "title of recipe" })
  title: string;

  @Field((type) => [Rate])
  ratings: Rate[];

  @Field({ nullable: true })
  avarageRating?: number;
}

@ObjectType()
class Rate {
  @Field((type) => Int)
  value: number;

  @Field()
  date: Date;
}

@ObjectType("ExternalTypeName")
class InternalClassName {
  @Field({ name: "externalFieldName" })
  internalPropertyName: string;
}

@ArgsType()
class GetRecipeArgs {
  @Field((type) => Int, { nullable: true })
  skip?: number;

  @Field((type) => Int, { nullable: true })
  take?: number;

  @Field((type) => String, { nullable: true })
  title?: string;

  get startIndex(): number {
    return this.skip || 0;
  }

  get endIndex(): number {
    const skip = this.skip || 0;
    const take = this.take || 0;
    return skip + take;
  }
}

@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];

  @Query((returns) => [Recipe])
  async recipes(
    @Args() { title, skip, take, startIndex, endIndex }: GetRecipeArgs
  ): Promise<Recipe[]> {
    let recipes = this.recipesCollection;
    if (title) {
      recipes = recipes.filter((recipe) => recipe.title === title);
    }
    return recipes.slice(startIndex, endIndex);
  }
}

const startServer = async () => {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [RecipeResolver],
  });

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
  });
  const PORT = process.env.PORT || 4000;
  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
};

startServer();
