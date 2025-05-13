import { Route } from '@angular/router';
import { HuntBishoComponent } from './pages/hunt-bisho.component';
import { AchievementsComponent, JediMindTrickAnimationComponent } from './components';


export const appRoutes: Route[] = [
    { path: 'logros', component: AchievementsComponent },
    { path: 'secret', component: JediMindTrickAnimationComponent },
    { path: 'home', component: HuntBishoComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
