import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
describe('CategoriesService', () => {

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoriesService],
        }).compile();
    });

    it('should work', () => {
        return true;
    })

});
