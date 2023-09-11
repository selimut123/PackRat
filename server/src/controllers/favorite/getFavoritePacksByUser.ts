import { PackNotFoundError } from '../../helpers/errors';
import { responseHandler } from '../../helpers/responseHandler';
import { getFavoritePacksByUserService } from '../../services/favorite/favorite.service';
import { publicProcedure } from '../../trpc';
import * as validator from "../../../../packages/src/validations"

/**
 * Retrieves favorite packs for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} - The favorite packs of the user.
 */
export const getFavoritePacksByUser = async (req, res, next) => {
  const { userId } = req.body;
  const packs = await getFavoritePacksByUserService(userId);
  if (!packs) next(PackNotFoundError);
  res.locals.data = packs;
  responseHandler(res);
};

export function getFavoritePacksByUserRoute() {
  return publicProcedure.input(validator.getUserById).query(async (opts) => {
    const { userId } = opts.input;
    const packs = await getFavoritePacksByUserService(userId);
    return packs;
  });
}