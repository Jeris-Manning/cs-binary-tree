import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {SimCard} from '../../Bridge/misc/Card';
import {Jewels} from '../../stores/RootStore';
import {MarkdownEditor, MarkdownPreview} from '../utils/MarkdownComponents';
import thyme from '../../Bridge/thyme';
import $j from '../../Bridge/misc/$j';
import {NewsUpdata} from '../../datum/NewsUpdata';
import Butt from '../../Bridge/Bricks/Butt';
import {MdAddBox, MdClose, MdEdit, MdRefresh, MdSave} from 'react-icons/md';
import {Ico, UpIco} from '../../Bridge/Bricks/Ico';
import {IoMdEyeOff} from 'react-icons/io';
import {UpFieldFit, UpRow, UpTog} from '../../Bridge/misc/UpField';
import {Hokey} from '../../misc/Hotkeys';
import './AppNews.css';
import {FaBullhorn} from 'react-icons/fa';

@observer
export class AppNews extends React.Component {
	render() {
		const vStaffNews = Jewels().vStaffNews;
		
		const title = 'Terp News';
		const subtitle = `News posted here will appear in the ASLIS On the Go interpreter app!`;
		
		return (
			<>
				<Row childV>
					
					<Butt
						on={() => vStaffNews.EditNews()}
						icon={MdAddBox}
						label={'Add'}
						secondary
						w={120}
					/>
					
					<Col grow/>
					
					<Col marB={12} childCenterH>
						<Txt
							size={'2.4rem'}
						>{title}</Txt>
						
						<Txt
							size={'1.2rem'}
							marT={6}
						>{subtitle}</Txt>
					</Col>
					
					<Col grow/>
					
					<Butt
						on={vStaffNews.LoadNews}
						icon={MdRefresh}
						tooltip={'Refresh'}
						primary
						subtle
						w={120}
					/>
				
				</Row>
				
				<Row childCenterH>
					<SimCard maxWidth={1200} grow shrink>
						
						{vStaffNews.isEditing ? (
							<NewsEditor/>
						) : (
							<NewsList/>
						)}
					
					</SimCard>
					
					<Col w={480}>
						
						<NewsPreview/>
					
					</Col>
				</Row>
			</>
		);
	}
}

@observer
class NewsList extends React.Component {
	render() {
		const {
			containerHeight
		} = this.props;
		
		const vStaffNews = Jewels().vStaffNews;
		
		const news = [...vStaffNews.newsLup.values()];
		
		return (
			<Col scrollV h={containerHeight || 900}>
				{news.map(updata => (
					<NewsEntryRow
						key={`news_${updata.newsId.value}`}
						updata={updata}
					/>
				))}
			</Col>
		);
	}
}

@observer
class NewsEntryRow extends React.Component {
	render() {
		const vStaffNews = Jewels().vStaffNews;
		const updata: NewsUpdata = this.props.updata;
		
		const newsId = updata.newsId.value;
		const isSelected = newsId === vStaffNews.selectedNewsId;
		
		const postedAt = updata.postedAt.value || thyme.now();
		const adminOnly = updata.adminOnly.value;
		
		const titleSummary = $j.trunc(updata.summary.value, 50);
		
		return (
			<Row
				padV={3}
				childCenterV
				hue={isSelected ? '#cdd7ff' : '#fff'}
				onClick={() => vStaffNews.SelectNews(newsId)}
			>
				{adminOnly ? (
					<Row
						// childC
						w={64}
						marR={8}
					>
						<Ico
							icon={IoMdEyeOff}
							// size={14}
							tooltip={'Admin Only'}
							marL={12}
						/>
					</Row>
				) : (
					<Txt
						size={12}
						marR={8}
						w={64}
						b={isSelected}
					>
						{thyme.nice.dateTime.minimal(postedAt)}
					</Txt>
				)}
				<Txt
					hue={'#3c3c3c'}
					size={16}
					marR={16}
					b={isSelected}
				>
					{updata.title.value}
				</Txt>
				
				<Txt
					hue={'#8f8f8f'}
					size={14}
				>
					{titleSummary}
				</Txt>
				
				
				<Col grow/>
				
				<UpIco
					state={updata.notificationAt}
					icon={FaBullhorn}
					tooltip={[
						`Notification was sent at:`,
						thyme.nice.dateTime.short(updata.notificationAt.value),
					]}
				/>
			
			</Row>
		);
	}
}

@observer
class NewsEditor extends React.Component {
	render() {
		const vStaffNews = Jewels().vStaffNews;
		
		const {
			containerHeight = 900,
		} = this.props;
		
		const updata = vStaffNews.editData;
		
		return (
			<Col
				scrollV
				h={containerHeight}
				fillH
			>
				
				<Hokey save={vStaffNews.SaveNews}/>
				
				<Row
					childV
					marR={12}
				>
					
					<Butt
						on={vStaffNews.CancelEdit}
						icon={MdClose}
						tooltip={'Cancel'}
						danger
						square
						subtle
						h={60}
						// w={140}
					/>
					
					<Col grow/>
					
					<UpTog
						state={updata.adminOnly}
						label={'Admin Only'}
						tooltip={'When enabled, only admins can see this on the app.'}
						icon={IoMdEyeOff}
					/>
					
					<Col grow/>
					
					<Butt
						on={vStaffNews.SaveNews}
						icon={MdSave}
						label={'Save'}
						secondary
						mini
						square
						h={60}
						w={140}
						enabled={vStaffNews.canSave}
						tooltip={vStaffNews.saveTooltip}
						alertAfter={'Saved!'}
					/>
				
				</Row>
				
				<Row h={16}/>
				
				<UpRow>
					<UpFieldFit
						state={updata.title}
						label={'Title'}
					/>
					
					<UpFieldFit
						state={updata.author}
						label={'Author'}
						w={100}
					/>
				</UpRow>
				
				<UpRow>
					<UpFieldFit
						state={updata.summary}
						label={'Summary'}
						description={'Short summary (shown before terp taps on the news item'}
					/>
				</UpRow>
				
				<Row h={16}/>
				
				<MarkdownEditor
					value={updata.markdown.value}
					onChange={updata.markdown.Change}
					preview={'edit'}
					height={containerHeight}
					width={'100%'}
				/>
			</Col>
		);
	}
}

@observer
class NewsPreview extends React.Component {
	render() {
		const vStaffNews = Jewels().vStaffNews;
		
		const {
			containerHeight = 900,
		} = this.props;
		
		const updata = vStaffNews.previewData;
		
		if (!updata || !updata.newsId) {
			return <Col/>;
		}
		
		return (
			<>
				
				<Row marH={8}>
					{vStaffNews.isEditing ? (
						<Col w={60}/>
					) : (
						<Butt
							on={() => vStaffNews.EditNews(updata.newsId.value)}
							icon={MdEdit}
							tooltip={'Edit'}
							primary
							subtle
							w={60}
						/>
					)}
					
					<Col grow>
						<Txt
							size={24}
							b
							center
						>Device Preview (approximate)</Txt>
						
						<Txt
							i
							center
							size={14}
							marT={4}
						>Will look different depending on device, font size, etc.</Txt>
					</Col>
					
					<NotificationButton/>
				</Row>
				
				<SimCard
					h={containerHeight}
					marT={12}
					hue={'#01263e'}
					pad={'0'}
					border={'36px solid #000'}
					borderRadius={90}
					overflow={'hidden'}
					noSelect
				>
					<Row
						hue={'#01263e'}
						h={50}
					/>
					
					<Col
						padT={12}
						padH={36}
						hue={'#dce5ec'}
						scrollV
						h={containerHeight - 50 - 50 - 72}
						className={'phone_preview'}
					>
						<Txt
							b
							size={32}
						>{updata.title.value}</Txt>
						
						<Txt
							i
							marT={4}
							size={12}
						>{thyme.nice.dateTime.less(updata.postedAt.value)} by {updata.author.value}</Txt>
						
						
						<Row h={24}/>
						
						<MarkdownPreview
							source={updata.markdown.value}
						/>
						
						<Row h={36}/>
					
					</Col>
					
					<Row
						hue={'#01263e'}
						h={24}
					/>
				
				</SimCard>
			</>
		);
	}
}

@observer
class NotificationButton extends React.Component {
	render() {
		const vStaffNews = Jewels().vStaffNews;
		const updata = vStaffNews.previewData;
		
		if (vStaffNews.isEditing)
			return <Col w={60}/>;
		
		const buttProps = {
			on: () => vStaffNews.SendNotification(updata.newsId.value),
			icon: FaBullhorn,
			w: 60,
		};
		
		let subjectPreview = updata.title.value;
		if (updata.summary.value) subjectPreview += `: ${updata.summary.value}`;
		
		if (updata.adminOnly.value)
			return (
				<Butt
					{...buttProps}
					subtle
					tooltip={`Can't send notification for news marked Admin Only`}
					disabled={true}
					iconHue={'#a89f9f'}
				/>
			);
		
		if (updata.notificationAt.value)
			return (
				<Butt
					{...buttProps}
					subtle
					tooltip={[
						`Notification was already sent at:`,
						thyme.nice.dateTime.short(updata.notificationAt.value),
						`Press this to send again (or maybe don't? 😅)`,
						`Subject will be:`,
						subjectPreview,
					]}
				/>
			);
		
		
		return (
			<Butt
				{...buttProps}
				tooltip={[
					`Send Notification to ALL interpreters`,
					`Subject will be:`,
					subjectPreview,
				]}
				primary
			/>
		);
	}
}